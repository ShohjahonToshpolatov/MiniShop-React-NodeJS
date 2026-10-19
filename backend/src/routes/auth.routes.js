import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";
import { sendMail } from "../utils/mailer.js";

const router = Router();

function createToken(user) {
  const { id, name, email } = user;
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  let user;
  try {
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hash],
    );
    user = result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }
    throw error;
  }

  const token = createToken(user);
  await sendMail(
    email,
    "Mini Shop — Xush kelibsiz!",
    "<h2>Mini Shopga xush kelibsiz!</h2><p>Ro‘yxatdan muvaffaqiyatli o‘tdingiz.</p>",
  );
  res.status(201).json({ user, token });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const result = await query(
    "SELECT id, name, email, password FROM users WHERE email = $1",
    [email],
  );
  const found = result.rows[0];

  if (!found || !(await bcrypt.compare(password, found.password))) {
    return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
  }

  const user = { id: found.id, name: found.name, email: found.email };
  res.json({ user, token: createToken(user) });
});

export default router;

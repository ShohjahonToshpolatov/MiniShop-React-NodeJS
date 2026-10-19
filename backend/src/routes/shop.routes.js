import { Router } from "express";
import { pool, query } from "../db.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { orderSchema } from "../validators/schemas.js";
import { sendMail } from "../utils/mailer.js";

const router = Router();

const escapeHtml = (str) =>
  String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

router.get("/products", async (req, res) => {
  const { rows } = await query(
    "SELECT id, title, price, image, in_stock FROM products ORDER BY id",
  );
  res.json(rows);
});

router.post("/orders", auth, validate(orderSchema), async (req, res) => {
  const client = await pool.connect();
  let order,
    items = [];

  try {
    await client.query("BEGIN");
    let total = 0;

    for (const item of req.body.items) {
      const { rows } = await client.query(
        "SELECT id, title, price, in_stock FROM products WHERE id = $1 FOR SHARE",
        [item.productId],
      );
      const product = rows[0];

      if (!product || !product.in_stock) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `Mahsulot mavjud emas: #${item.productId}` });
      }

      total += product.price * item.quantity;
      items.push({ ...product, quantity: item.quantity });
    }

    if (total > 2147483647) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Buyurtma summasi juda katta" });
    }

    const orderRes = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, total, created_at",
      [req.user.id, total],
    );
    order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [order.id, item.id, item.quantity, item.price],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const list = items
    .map(
      (i) =>
        `<li>${escapeHtml(i.title)}: ${i.quantity} dona × ${i.price} so‘m = ${i.quantity * i.price} so‘m</li>`,
    )
    .join("");

  await sendMail(
    req.user.email,
    `Mini Shop — Buyurtma #${order.id}`,
    `<h2>Buyurtma qabul qilindi</h2><ul>${list}</ul><p>Jami: <strong>${order.total} so‘m</strong></p>`,
  );

  res.status(201).json({ message: "Buyurtma qabul qilindi", order });
});

router.get("/orders/my", auth, async (req, res) => {
  const { rows } = await query(
    "SELECT id, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC, id DESC",
    [req.user.id],
  );
  res.json(rows);
});

export default router;

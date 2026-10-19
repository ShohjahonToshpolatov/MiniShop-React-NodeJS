import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.get("Authorization");

  if (!header) {
    return res.status(401).json({
      message: "Avval tizimga kiring",
    });
  }

  const match = header.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return res.status(401).json({
      message: "Token yaroqsiz yoki muddati o'tgan",
    });
  }

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    next();
  } catch {
    return res.status(401).json({
      message: "Token yaroqsiz yoki muddati o'tgan",
    });
  }
}

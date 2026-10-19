import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import shopRoutes from "./routes/shop.routes.js";

for (const name of ["DATABASE_URL", "JWT_SECRET"]) {
  if (!process.env[name] || process.env[name].startsWith("REPLACE_")) {
    throw new Error(`${name} .env faylida sozlanishi kerak`);
  }
}

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", authRoutes);
app.use("/api", shopRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Sahifa topilmadi" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "JSON formati noto'g'ri" });
  }

  if (error.status === 413 || error.statusCode === 413) {
    return res.status(413).json({ message: "So'rov hajmi juda katta" });
  }

  console.error("Serverda xatolik:", error.message);
  res.status(500).json({ message: "Serverda xatolik" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});

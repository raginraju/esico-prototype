// src/server/index.ts
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import auth from "./routes/auth";
import certificatesRouter from "./routes/certificates";
import type { Env } from "./env";

const app = new Hono<{ Bindings: Env }>();

app.use(trimTrailingSlash());

// ---------------- MOUNT ROUTERS ----------------

app.route("/api/auth", auth);
app.route("/api/certificates", certificatesRouter);

// ---------------- STATIC ASSETS & 404 FALLBACK ----------------

app.all("/api/*", (c) =>
  c.json({ status: "error", message: "Endpoint not found" }, 404)
);

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw as any) as any);

export default app;
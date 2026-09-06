import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { users } from "../../../db/schema";
import type { Env } from "../env";
import { verifyJwt } from "./jwt";

type RequestContext = Context<{ Bindings: Env }>;

export type RequestActor = {
  id: string;
  email: string;
  role: string;
};

const anonymousActor: RequestActor = {
  id: "anonymous",
  email: "anonymous",
  role: "anonymous",
};

export async function getRequestActor(c: RequestContext): Promise<RequestActor> {
  const cookieHeader = c.req.header("Cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("esico_session="))
    ?.slice("esico_session=".length);

  if (!token) return anonymousActor;
  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) return anonymousActor;

  const user = await drizzle(c.env.DB)
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, payload.sub))
    .get();

  return user ?? anonymousActor;
}

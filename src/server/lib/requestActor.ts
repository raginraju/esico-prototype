import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { users } from "../../../db/schema";
import type { Env } from "../env";

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
  const authorization = c.req.header("Authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token?.startsWith("demo_token_")) {
    return anonymousActor;
  }

  const userId = token.slice("demo_token_".length);
  if (!userId) {
    return anonymousActor;
  }

  const user = await drizzle(c.env.DB)
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  return user ?? anonymousActor;
}

// src/server/routes/idCards.ts
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { desc, eq } from "drizzle-orm";
import { idCards, type NewIDCard } from "../../../db/schema";
import type { Env } from "../env";
import { getRequestActor } from "../lib/requestActor";
import { auditLogger } from "../lib/logger";

const idCardsRouter = new Hono<{ Bindings: Env }>();

// GET /api/idcards
idCardsRouter.get("/", async (c) => {
  const actor = await getRequestActor(c);
  const db = drizzle(c.env.DB);
  const records = await db
    .select()
    .from(idCards)
    .orderBy(desc(idCards.created_at));

  auditLogger.info("idcards.list", "ID cards retrieved", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    count: records.length,
  });

  return c.json({
    status: "success",
    data: records,
  });
});

// POST /api/idcards
idCardsRouter.post("/", async (c) => {
  const actor = await getRequestActor(c);
  const body = await c.req.parseBody();

  const name = (body["name"] as string)?.trim();
  const company_name = (body["company_name"] as string)?.trim() || "";
  const file_number = (body["file_number"] as string)?.trim();
  const civil_id_number = (body["civil_id_number"] as string)?.trim();
  const designation = (body["designation"] as string)?.trim() || "N/A";
  const type_model = (body["type_model"] as string)?.trim() || "";
  const capacity_swl = (body["capacity_swl"] as string)?.trim() || "";
  const expiry_date = (body["expiry_date"] as string)?.trim() || "";
  const file = body["file"];

  if (!name || !file_number || !civil_id_number) {
    auditLogger.warn("idcards.create", "Rejected request: missing required fields", {
      actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
      item: { type: "id_card", reference: "unspecified" },
    });
    return c.json(
      {
        status: "error",
        message: "name, file_number, and civil_id_number are required",
      },
      400
    );
  }

  const cardId = crypto.randomUUID();

  let fileUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (!c.env.ID_CARD_BUCKET) {
      return c.json(
        { status: "error", message: "ID card storage is not configured" },
        503
      );
    }

    const objectKey = `id-cards/${cardId}`;
    await c.env.ID_CARD_BUCKET.put(objectKey, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
    });
    fileUrl = `/api/idcards/${cardId}/file`;
  }

  const newCard: NewIDCard = {
    id: cardId,
    name,
    company_name,
    file_number,
    civil_id_number,
    designation,
    type_model,
    capacity_swl,
    expiry_date: expiry_date || new Date().toISOString().split("T")[0],
    file_url: fileUrl,
    created_at: new Date().toISOString(),
  };

  const db = drizzle(c.env.DB);
  await db.insert(idCards).values(newCard);

  auditLogger.info("idcards.create", "ID card created", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    item: { type: "id_card", reference: cardId },
    hasFile: fileUrl !== null,
  });

  return c.json(
    {
      status: "success",
      message: "ID card created successfully",
      data: newCard,
    },
    201
  );
});

// PUT /api/idcards/:id
idCardsRouter.put("/:id", async (c) => {
  const actor = await getRequestActor(c);
  const id = c.req.param("id");
  const body = await c.req.parseBody();
  const db = drizzle(c.env.DB);
  const existing = await db.select().from(idCards).where(eq(idCards.id, id)).get();

  if (!existing) {
    return c.json({ status: "error", message: "ID card not found" }, 404);
  }

  const value = (key: string, fallback: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : fallback;
  const name = value("name", existing.name);
  const file_number = value("file_number", existing.file_number);
  const civil_id_number = value("civil_id_number", existing.civil_id_number);

  if (!name || !file_number || !civil_id_number) {
    return c.json({
      status: "error",
      message: "name, file_number, and civil_id_number are required",
    }, 400);
  }

  let fileUrl = existing.file_url;
  const file = body["file"];
  if (file instanceof File && file.size > 0) {
    if (!c.env.ID_CARD_BUCKET) {
      return c.json({ status: "error", message: "ID card storage is not configured" }, 503);
    }

    await c.env.ID_CARD_BUCKET.put(`id-cards/${id}`, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
    fileUrl = `/api/idcards/${id}/file`;
  }

  const updates = {
    name,
    company_name: value("company_name", existing.company_name),
    file_number,
    civil_id_number,
    designation: value("designation", existing.designation),
    type_model: value("type_model", existing.type_model),
    capacity_swl: value("capacity_swl", existing.capacity_swl),
    expiry_date: value("expiry_date", existing.expiry_date),
    file_url: fileUrl,
  };

  await db.update(idCards).set(updates).where(eq(idCards.id, id));

  auditLogger.info("idcards.update", "ID card updated", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    item: { type: "id_card", reference: id },
    hasFile: fileUrl !== null,
  });

  return c.json({
    status: "success",
    message: "ID card updated successfully",
    data: { ...existing, ...updates },
  });
});

// GET /api/idcards/:id/file
idCardsRouter.get("/:id/file", async (c) => {
  if (!c.env.ID_CARD_BUCKET) {
    return c.json({ status: "error", message: "ID card storage is not configured" }, 503);
  }

  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const card = await db
    .select({ fileUrl: idCards.file_url })
    .from(idCards)
    .where(eq(idCards.id, id))
    .get();

  if (!card?.fileUrl) {
    return c.json({ status: "error", message: "ID card file not found" }, 404);
  }

  const object = await c.env.ID_CARD_BUCKET.get(`id-cards/${id}`);

  if (!object) {
    return c.json({ status: "error", message: "ID card file not found" }, 404);
  }

  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set("content-type", object.httpMetadata.contentType);
  }
  headers.set("etag", object.httpEtag);
  return new Response(object.body as unknown as BodyInit, { headers });
});

// DELETE /api/idcards/:id
idCardsRouter.delete("/:id", async (c) => {
  const actor = await getRequestActor(c);
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);

  if (c.env.ID_CARD_BUCKET) {
    await c.env.ID_CARD_BUCKET.delete(`id-cards/${id}`);
  }

  await db.delete(idCards).where(eq(idCards.id, id));

  auditLogger.info("idcards.delete", "ID card deleted", {
    actor: { id: actor.id, authenticated: actor.id !== "anonymous", role: actor.role },
    item: { type: "id_card", reference: id },
  });

  return c.json({
    status: "success",
    message: "ID card deleted successfully",
  });
});

export default idCardsRouter;
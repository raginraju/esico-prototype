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
  const file_number = (body["file_number"] as string)?.trim();
  const civil_id_number = (body["civil_id_number"] as string)?.trim();
  const designation = (body["designation"] as string)?.trim() || "N/A";
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

  // Generate a mock placeholder file URL if a file is present
  let fileUrl: string | null = null;
  if (file instanceof File && file.size > 0) {
    const sanitizedName = file.name.replace(/\s+/g, "_");
    fileUrl = `/uploads/temp_${cardId.slice(0, 8)}_${sanitizedName}`;
  }

  const newCard: NewIDCard = {
    id: cardId,
    name,
    file_number,
    civil_id_number,
    designation,
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

// DELETE /api/idcards/:id
idCardsRouter.delete("/:id", async (c) => {
  const actor = await getRequestActor(c);
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);

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
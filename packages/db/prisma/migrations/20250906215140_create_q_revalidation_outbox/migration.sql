-- CreateTable
CREATE TABLE "q_revalidation_outbox" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" VARCHAR(32) NOT NULL,
    "entity_id" UUID,
    "event" VARCHAR(16) NOT NULL,
    "payload" JSONB,
    "status" VARCHAR(16) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ,

    CONSTRAINT "q_revalidation_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "q_revalidation_outbox_status_created_at_idx" ON "q_revalidation_outbox"("status", "created_at");

-- CreateIndex
CREATE INDEX "q_revalidation_outbox_entity_type_entity_id_idx" ON "q_revalidation_outbox"("entity_type", "entity_id");

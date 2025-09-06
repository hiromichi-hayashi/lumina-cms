-- CreateTable
CREATE TABLE "m_media_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "provider" VARCHAR(32) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "hash" TEXT,
    "uploaded_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_media_assets_hash_key" ON "m_media_assets"("hash");

-- AddForeignKey
ALTER TABLE "m_media_assets" ADD CONSTRAINT "m_media_assets_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

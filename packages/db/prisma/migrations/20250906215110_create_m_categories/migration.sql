-- CreateTable
CREATE TABLE "m_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(80) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "m_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_categories_slug_key" ON "m_categories"("slug");

-- CreateIndex
CREATE INDEX "m_categories_parent_id_idx" ON "m_categories"("parent_id");

-- CreateIndex
CREATE INDEX "m_categories_sort_order_idx" ON "m_categories"("sort_order");

-- AddForeignKey
ALTER TABLE "m_categories" ADD CONSTRAINT "m_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "m_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

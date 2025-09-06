-- CreateTable
CREATE TABLE "c_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "content_md" TEXT NOT NULL,
    "excerpt" TEXT,
    "status" VARCHAR(16) NOT NULL DEFAULT 'draft',
    "scheduled_at" TIMESTAMPTZ,
    "published_at" TIMESTAMPTZ,
    "author_id" UUID NOT NULL,
    "category_id" UUID,
    "cover_image_id" UUID,
    "seo_title" VARCHAR(160),
    "seo_description" VARCHAR(200),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "c_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "c_posts_slug_key" ON "c_posts"("slug");

-- CreateIndex
CREATE INDEX "c_posts_status_idx" ON "c_posts"("status");

-- CreateIndex
CREATE INDEX "c_posts_author_id_idx" ON "c_posts"("author_id");

-- CreateIndex
CREATE INDEX "c_posts_category_id_idx" ON "c_posts"("category_id");

-- CreateIndex
CREATE INDEX "c_posts_updated_at_idx" ON "c_posts"("updated_at" DESC);

-- CreateIndex
CREATE INDEX "c_posts_published_at_idx" ON "c_posts"("published_at" DESC);

-- AddForeignKey
ALTER TABLE "c_posts" ADD CONSTRAINT "c_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "c_posts" ADD CONSTRAINT "c_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "m_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "c_posts" ADD CONSTRAINT "c_posts_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "m_media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

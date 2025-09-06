-- CreateTable
CREATE TABLE "r_posts_tags" (
    "post_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "r_posts_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateIndex
CREATE INDEX "r_posts_tags_tag_id_idx" ON "r_posts_tags"("tag_id");

-- CreateIndex
CREATE INDEX "r_posts_tags_post_id_idx" ON "r_posts_tags"("post_id");

-- AddForeignKey
ALTER TABLE "r_posts_tags" ADD CONSTRAINT "r_posts_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "c_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "r_posts_tags" ADD CONSTRAINT "r_posts_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "m_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "c_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_id" UUID,
    "body" TEXT NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "c_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "a_comment_moderation_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comment_id" UUID NOT NULL,
    "from_status" VARCHAR(16),
    "to_status" VARCHAR(16) NOT NULL,
    "changed_by" UUID,
    "reason" TEXT,
    "changed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "a_comment_moderation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "c_comments_post_id_status_created_at_idx" ON "c_comments"("post_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "c_comments_parent_id_idx" ON "c_comments"("parent_id");

-- CreateIndex
CREATE INDEX "c_comments_user_id_idx" ON "c_comments"("user_id");

-- CreateIndex
CREATE INDEX "a_comment_moderation_history_comment_id_changed_at_idx" ON "a_comment_moderation_history"("comment_id", "changed_at" DESC);

-- AddForeignKey
ALTER TABLE "c_comments" ADD CONSTRAINT "c_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "c_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "c_comments" ADD CONSTRAINT "c_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "c_comments" ADD CONSTRAINT "c_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "c_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_comment_moderation_history" ADD CONSTRAINT "a_comment_moderation_history_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "c_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_comment_moderation_history" ADD CONSTRAINT "a_comment_moderation_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

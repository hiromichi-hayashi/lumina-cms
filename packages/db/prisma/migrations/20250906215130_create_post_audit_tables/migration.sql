-- CreateTable
CREATE TABLE "a_post_revisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content_md" TEXT NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "a_post_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "a_post_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "from_status" VARCHAR(16),
    "to_status" VARCHAR(16) NOT NULL,
    "changed_by" UUID,
    "note" TEXT,
    "changed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "a_post_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "a_post_revisions_post_id_version_key" ON "a_post_revisions"("post_id", "version");

-- CreateIndex
CREATE INDEX "a_post_revisions_post_id_idx" ON "a_post_revisions"("post_id");

-- CreateIndex
CREATE INDEX "a_post_status_history_post_id_changed_at_idx" ON "a_post_status_history"("post_id", "changed_at" DESC);

-- AddForeignKey
ALTER TABLE "a_post_revisions" ADD CONSTRAINT "a_post_revisions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "c_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_post_revisions" ADD CONSTRAINT "a_post_revisions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_post_status_history" ADD CONSTRAINT "a_post_status_history_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "c_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_post_status_history" ADD CONSTRAINT "a_post_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

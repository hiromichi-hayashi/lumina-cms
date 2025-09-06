-- CreateTable
CREATE TABLE "a_user_role_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "from_role" VARCHAR(32),
    "to_role" VARCHAR(32) NOT NULL,
    "changed_by" UUID,
    "changed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "a_user_role_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "a_user_login_audit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "provider" VARCHAR(32),
    "ip_address" INET,
    "user_agent" TEXT,
    "success" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "a_user_login_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "a_user_invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(32) NOT NULL,
    "invited_by" UUID,
    "token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" VARCHAR(16) NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMPTZ,

    CONSTRAINT "a_user_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "a_user_role_history_user_id_changed_at_idx" ON "a_user_role_history"("user_id", "changed_at" DESC);

-- CreateIndex
CREATE INDEX "a_user_login_audit_user_id_created_at_idx" ON "a_user_login_audit"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "a_user_invites_email_key" ON "a_user_invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "a_user_invites_token_key" ON "a_user_invites"("token");

-- CreateIndex
CREATE INDEX "a_user_invites_status_idx" ON "a_user_invites"("status");

-- AddForeignKey
ALTER TABLE "a_user_role_history" ADD CONSTRAINT "a_user_role_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_user_role_history" ADD CONSTRAINT "a_user_role_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_user_login_audit" ADD CONSTRAINT "a_user_login_audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "a_user_invites" ADD CONSTRAINT "a_user_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "m_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "m_users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT,
    "role" VARCHAR(32) NOT NULL DEFAULT 'public',
    "status" VARCHAR(16) NOT NULL DEFAULT 'active',
    "provider" VARCHAR(32),
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "m_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_users_email_key" ON "m_users"("email");

-- CreateIndex
CREATE INDEX "m_users_role_idx" ON "m_users"("role");

-- CreateIndex
CREATE INDEX "m_users_status_idx" ON "m_users"("status");

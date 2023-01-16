-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "status" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "logs_priority_rel" (
    "log_priority_id" SERIAL NOT NULL,
    "log_priority_name" VARCHAR(255) NOT NULL,
    "log_priority_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_priority_pkey" PRIMARY KEY ("log_priority_id")
);

-- CreateTable
CREATE TABLE "logs_status_rel" (
    "log_status_id" SERIAL NOT NULL,
    "log_status_name" VARCHAR(255) NOT NULL,
    "log_status_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_status_pkey" PRIMARY KEY ("log_status_id")
);

-- CreateTable
CREATE TABLE "projects_status_rel" (
    "project_status_id" SERIAL NOT NULL,
    "project_status_name" VARCHAR(255) NOT NULL,
    "project_status_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_status_pkey" PRIMARY KEY ("project_status_id")
);

-- CreateTable
CREATE TABLE "users_role_rel" (
    "user_role_id" SERIAL NOT NULL,
    "user_role_name" VARCHAR(255) NOT NULL,
    "user_role_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_role_pkey" PRIMARY KEY ("user_role_id")
);

-- CreateTable
CREATE TABLE "users_status_rel" (
    "user_status_id" SERIAL NOT NULL,
    "user_status_name" VARCHAR(255) NOT NULL,
    "user_status_description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_status_pkey" PRIMARY KEY ("user_status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_priority_log_priority_name_key" ON "logs_priority_rel"("log_priority_name");

-- CreateIndex
CREATE UNIQUE INDEX "log_status_log_status_name_key" ON "logs_status_rel"("log_status_name");

-- CreateIndex
CREATE UNIQUE INDEX "project_status_project_status_name_key" ON "projects_status_rel"("project_status_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_role_user_role_name_key" ON "users_role_rel"("user_role_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_status_user_status_name_key" ON "users_status_rel"("user_status_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "users_role_rel"("user_role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_status_fkey" FOREIGN KEY ("status") REFERENCES "users_status_rel"("user_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

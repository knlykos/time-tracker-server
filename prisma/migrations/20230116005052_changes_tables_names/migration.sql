-- CreateEnum
CREATE TYPE "priority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "status_log" AS ENUM ('running', 'ended');

-- CreateTable
CREATE TABLE "logs" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "org_id" INTEGER,
    "date" TIMESTAMP(6) NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMP(6),
    "duration" TIME(6),
    "client_id" INTEGER,
    "project_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "timesheet_id" INTEGER,
    "invoice_id" INTEGER,
    "notes" TEXT,
    "billable" BOOLEAN DEFAULT false,
    "status" "status_log" NOT NULL DEFAULT 'running',

    CONSTRAINT "log_pk" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "org_id" INTEGER,
    "name" VARCHAR(80) NOT NULL,
    "description" INTEGER,
    "status" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "projects_pkey1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "task_id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "org_id" INTEGER,
    "task_name" VARCHAR(80) NOT NULL,
    "task_description" VARCHAR(255),
    "project_id" INTEGER,
    "priority" "priority" NOT NULL DEFAULT 'medium',
    "estimated_time" INTEGER,
    "assignee" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(6),
    "task_status" "status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "projects_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "username" VARCHAR(120) NOT NULL,
    "password" VARCHAR(120),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "group_id" INTEGER NOT NULL,
    "org_id" INTEGER,
    "role_id" INTEGER,
    "client_id" INTEGER,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "quota_percent" BIGINT DEFAULT 100000000,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_key" ON "projects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_id_key" ON "tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

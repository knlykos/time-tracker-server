-- RenameForeignKey
ALTER TABLE "logs" RENAME CONSTRAINT "logs_tasks_id_fk" TO "logs_tasks_null_fk";

/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `TodoStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
-- 기존 IN_PROGRESS 상태를 PENDING으로 변환
UPDATE "public"."todos" SET "status" = 'PENDING' WHERE "status" = 'IN_PROGRESS';

-- 새로운 enum 타입 생성
CREATE TYPE "public"."TodoStatus_new" AS ENUM ('PENDING', 'COMPLETED');
ALTER TABLE "public"."todos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."todos" ALTER COLUMN "status" TYPE "public"."TodoStatus_new" USING ("status"::text::"public"."TodoStatus_new");
ALTER TYPE "public"."TodoStatus" RENAME TO "TodoStatus_old";
ALTER TYPE "public"."TodoStatus_new" RENAME TO "TodoStatus";
DROP TYPE "public"."TodoStatus_old";
ALTER TABLE "public"."todos" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

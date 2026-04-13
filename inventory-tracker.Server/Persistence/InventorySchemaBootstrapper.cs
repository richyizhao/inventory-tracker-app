using Microsoft.EntityFrameworkCore;

namespace inventory_management.Server.Persistence;

public static class InventorySchemaBootstrapper
{
    public static void EnsureInventorySchema(AppDbContext dbContext)
    {
        dbContext.Database.ExecuteSqlRaw(
            """
            ALTER TABLE "Roles" ADD COLUMN IF NOT EXISTS "Permissions" text[] NOT NULL DEFAULT ARRAY[]::text[];

            ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "Name" text;
            ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "FirstName" text NOT NULL DEFAULT '';
            ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "LastName" text NOT NULL DEFAULT '';
            ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "CreatedAt" timestamp with time zone;
            UPDATE "Users"
            SET
                "Name" = COALESCE(
                    NULLIF(TRIM(CONCAT_WS(' ', "FirstName", "LastName")), ''),
                    NULLIF("Name", ''),
                    split_part("Email", '@', 1)
                ),
                "CreatedAt" = COALESCE("CreatedAt", NOW());
            ALTER TABLE "Users" ALTER COLUMN "Name" SET NOT NULL;
            ALTER TABLE "Users" ALTER COLUMN "CreatedAt" SET NOT NULL;
            ALTER TABLE "Users" ALTER COLUMN "CreatedAt" SET DEFAULT NOW();
            """);

        dbContext.Database.ExecuteSqlRaw(
            """
            DELETE FROM "UserRoles"
            WHERE "RoleId" IN (
                SELECT "Id" FROM "Roles" WHERE LOWER("Name") = 'viewer'
            );

            DELETE FROM "Roles"
            WHERE LOWER("Name") = 'viewer';
            """);

        dbContext.Database.ExecuteSqlRaw(
            """
            CREATE TABLE IF NOT EXISTS "ProductCategories" (
                "Id" uuid NOT NULL PRIMARY KEY,
                "Name" text NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_ProductCategories_Name" ON "ProductCategories" ("Name");

            ALTER TABLE "Categories" ADD COLUMN IF NOT EXISTS "CategoryId" uuid;
            DROP INDEX IF EXISTS "IX_Categories_Name";
            CREATE INDEX IF NOT EXISTS "IX_Categories_CategoryId" ON "Categories" ("CategoryId");
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_Categories_CategoryId_Name" ON "Categories" ("CategoryId", "Name");
            """);

        dbContext.Database.ExecuteSqlRaw(
            """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_constraint
                    WHERE conname = 'FK_Categories_ProductCategories_CategoryId'
                ) THEN
                    ALTER TABLE "Categories"
                    ADD CONSTRAINT "FK_Categories_ProductCategories_CategoryId"
                    FOREIGN KEY ("CategoryId") REFERENCES "ProductCategories" ("Id") ON DELETE CASCADE;
                END IF;
            END $$;
            """);

        dbContext.Database.ExecuteSqlRaw(
            """
            CREATE TABLE IF NOT EXISTS "Products" (
                "Id" uuid NOT NULL PRIMARY KEY,
                "Name" text NOT NULL,
                "Sku" text NOT NULL,
                "Description" text NOT NULL DEFAULT '',
                "ImageUrl" text NOT NULL DEFAULT '',
                "Quantity" integer NOT NULL DEFAULT 0,
                "UnitCost" numeric(18,2) NOT NULL DEFAULT 0,
                "SellingPrice" numeric(18,2) NOT NULL DEFAULT 0,
                "CategoryId" uuid NOT NULL,
                "CreatedAt" timestamp with time zone NOT NULL,
                "UpdatedAt" timestamp with time zone NOT NULL,
                CONSTRAINT "FK_Products_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("Id") ON DELETE RESTRICT,
                CONSTRAINT "CK_Products_Quantity_NonNegative" CHECK ("Quantity" >= 0),
                CONSTRAINT "CK_Products_UnitCost_NonNegative" CHECK ("UnitCost" >= 0),
                CONSTRAINT "CK_Products_SellingPrice_NonNegative" CHECK ("SellingPrice" >= 0)
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_Products_Sku" ON "Products" ("Sku");
            CREATE INDEX IF NOT EXISTS "IX_Products_CategoryId" ON "Products" ("CategoryId");

            ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "UnitCost" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "SellingPrice" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "ImageUrl" text NOT NULL DEFAULT '';
            ALTER TABLE "Products" DROP CONSTRAINT IF EXISTS "CK_Products_UnitCost_NonNegative";
            ALTER TABLE "Products" ADD CONSTRAINT "CK_Products_UnitCost_NonNegative" CHECK ("UnitCost" >= 0);
            ALTER TABLE "Products" DROP CONSTRAINT IF EXISTS "CK_Products_SellingPrice_NonNegative";
            ALTER TABLE "Products" ADD CONSTRAINT "CK_Products_SellingPrice_NonNegative" CHECK ("SellingPrice" >= 0);
            """);

        dbContext.Database.ExecuteSqlRaw(
            """
            CREATE TABLE IF NOT EXISTS "Transactions" (
                "Id" uuid NOT NULL PRIMARY KEY,
                "ProductId" uuid NOT NULL,
                "Type" text NOT NULL,
                "Quantity" integer NOT NULL,
                "UnitCost" numeric(18,2) NOT NULL DEFAULT 0,
                "UnitPrice" numeric(18,2) NOT NULL DEFAULT 0,
                "ExpenseAmount" numeric(18,2) NOT NULL DEFAULT 0,
                "UserId" uuid NOT NULL,
                "Note" text NOT NULL DEFAULT '',
                "CreatedAt" timestamp with time zone NOT NULL,
                CONSTRAINT "FK_Transactions_Products_ProductId" FOREIGN KEY ("ProductId") REFERENCES "Products" ("Id") ON DELETE CASCADE,
                CONSTRAINT "FK_Transactions_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
                CONSTRAINT "CK_Transactions_Quantity_Positive" CHECK ("Quantity" > 0),
                CONSTRAINT "CK_Transactions_UnitCost_NonNegative" CHECK ("UnitCost" >= 0),
                CONSTRAINT "CK_Transactions_UnitPrice_NonNegative" CHECK ("UnitPrice" >= 0),
                CONSTRAINT "CK_Transactions_ExpenseAmount_NonNegative" CHECK ("ExpenseAmount" >= 0)
            );
            CREATE INDEX IF NOT EXISTS "IX_Transactions_ProductId" ON "Transactions" ("ProductId");
            CREATE INDEX IF NOT EXISTS "IX_Transactions_UserId" ON "Transactions" ("UserId");
            CREATE INDEX IF NOT EXISTS "IX_Transactions_CreatedAt" ON "Transactions" ("CreatedAt");

            ALTER TABLE "Transactions" ADD COLUMN IF NOT EXISTS "UnitCost" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE "Transactions" ADD COLUMN IF NOT EXISTS "UnitPrice" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE "Transactions" ADD COLUMN IF NOT EXISTS "ExpenseAmount" numeric(18,2) NOT NULL DEFAULT 0;
            ALTER TABLE "Transactions" ADD COLUMN IF NOT EXISTS "Reason" text NOT NULL DEFAULT '';
            ALTER TABLE "Transactions" DROP CONSTRAINT IF EXISTS "CK_Transactions_UnitCost_NonNegative";
            ALTER TABLE "Transactions" ADD CONSTRAINT "CK_Transactions_UnitCost_NonNegative" CHECK ("UnitCost" >= 0);
            ALTER TABLE "Transactions" DROP CONSTRAINT IF EXISTS "CK_Transactions_UnitPrice_NonNegative";
            ALTER TABLE "Transactions" ADD CONSTRAINT "CK_Transactions_UnitPrice_NonNegative" CHECK ("UnitPrice" >= 0);
            ALTER TABLE "Transactions" DROP CONSTRAINT IF EXISTS "CK_Transactions_ExpenseAmount_NonNegative";
            ALTER TABLE "Transactions" ADD CONSTRAINT "CK_Transactions_ExpenseAmount_NonNegative" CHECK ("ExpenseAmount" >= 0);
            """);
    }
}


CREATE TABLE IF NOT EXISTS "DealContact" (
	"dealId" uuid NOT NULL,
	"contactId" uuid NOT NULL,
	"roleInDeal" varchar(100),
	CONSTRAINT "DealContact_dealId_contactId_pk" PRIMARY KEY("dealId","contactId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DealContact" ADD CONSTRAINT "DealContact_dealId_Deal_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."Deal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DealContact" ADD CONSTRAINT "DealContact_contactId_Contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

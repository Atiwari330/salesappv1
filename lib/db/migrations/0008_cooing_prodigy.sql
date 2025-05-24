CREATE TABLE IF NOT EXISTS "Transcript" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dealId" uuid NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"callDate" varchar(10) NOT NULL,
	"callTime" varchar(5) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_dealId_Deal_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."Deal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

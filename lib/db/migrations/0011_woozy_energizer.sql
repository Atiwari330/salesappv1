CREATE TABLE IF NOT EXISTS "ActionItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dealId" uuid NOT NULL,
	"description" text NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"isAISuggested" boolean DEFAULT false NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_dealId_Deal_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."Deal"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

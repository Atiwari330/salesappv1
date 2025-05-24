ALTER TABLE "ActionItem" ADD COLUMN "transcriptId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_transcriptId_Transcript_id_fk" FOREIGN KEY ("transcriptId") REFERENCES "public"."Transcript"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

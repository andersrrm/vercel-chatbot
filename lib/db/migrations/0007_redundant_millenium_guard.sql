CREATE TABLE IF NOT EXISTS "Assistant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"instructions" text NOT NULL,
	"avatar" text DEFAULT 'bot' NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "assistantId" uuid;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "assistantId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_assistantId_Assistant_id_fk" FOREIGN KEY ("assistantId") REFERENCES "public"."Assistant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Document" ADD CONSTRAINT "Document_assistantId_Assistant_id_fk" FOREIGN KEY ("assistantId") REFERENCES "public"."Assistant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

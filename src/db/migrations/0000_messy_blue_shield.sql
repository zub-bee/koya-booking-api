CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"slot_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

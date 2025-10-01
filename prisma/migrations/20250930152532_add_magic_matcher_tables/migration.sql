-- CreateTable
CREATE TABLE "public"."match_requests" (
    "id" SERIAL NOT NULL,
    "requester_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."talent_matches" (
    "id" SERIAL NOT NULL,
    "match_request_id" INTEGER NOT NULL,
    "talent_id" TEXT NOT NULL,
    "similarity_score" DOUBLE PRECISION NOT NULL,
    "ai_explanation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talent_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."match_swipes" (
    "id" SERIAL NOT NULL,
    "talent_match_id" INTEGER NOT NULL,
    "swipe_direction" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_swipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile_embeddings" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "text_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "match_requests_requester_id_idx" ON "public"."match_requests"("requester_id");

-- CreateIndex
CREATE INDEX "match_requests_status_idx" ON "public"."match_requests"("status");

-- CreateIndex
CREATE INDEX "talent_matches_match_request_id_idx" ON "public"."talent_matches"("match_request_id");

-- CreateIndex
CREATE INDEX "talent_matches_talent_id_idx" ON "public"."talent_matches"("talent_id");

-- CreateIndex
CREATE INDEX "talent_matches_similarity_score_idx" ON "public"."talent_matches"("similarity_score");

-- CreateIndex
CREATE UNIQUE INDEX "talent_matches_match_request_id_talent_id_key" ON "public"."talent_matches"("match_request_id", "talent_id");

-- CreateIndex
CREATE INDEX "match_swipes_swipe_direction_idx" ON "public"."match_swipes"("swipe_direction");

-- CreateIndex
CREATE UNIQUE INDEX "match_swipes_talent_match_id_key" ON "public"."match_swipes"("talent_match_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_embeddings_profile_id_key" ON "public"."profile_embeddings"("profile_id");

-- CreateIndex
CREATE INDEX "profile_embeddings_profile_id_idx" ON "public"."profile_embeddings"("profile_id");

-- AddForeignKey
ALTER TABLE "public"."match_requests" ADD CONSTRAINT "match_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."talent_matches" ADD CONSTRAINT "talent_matches_match_request_id_fkey" FOREIGN KEY ("match_request_id") REFERENCES "public"."match_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."talent_matches" ADD CONSTRAINT "talent_matches_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."match_swipes" ADD CONSTRAINT "match_swipes_talent_match_id_fkey" FOREIGN KEY ("talent_match_id") REFERENCES "public"."talent_matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile_embeddings" ADD CONSTRAINT "profile_embeddings_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

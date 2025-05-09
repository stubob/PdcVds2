-- CreateTable
CREATE TABLE "rider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "team_key" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "price_2025" INTEGER NOT NULL,
    "score_2025" INTEGER NOT NULL,
    "score_2024" INTEGER NOT NULL,
    "type" BOOLEAN NOT NULL,

    CONSTRAINT "rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "TradeTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" BOOLEAN NOT NULL,
    "year" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "score2025" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "draft_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_team_riders" (
    "id" SERIAL NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "draft_team_riders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_key" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "race_result" (
    "id" SERIAL NOT NULL,
    "rider_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL,
    "race_id" INTEGER NOT NULL,

    CONSTRAINT "race_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateIndex
CREATE UNIQUE INDEX "draft_team_riders_rider_id_user_id_team_id_key" ON "draft_team_riders"("rider_id", "user_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "race_result_race_id_sequence_key" ON "race_result"("race_id", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- AddForeignKey
ALTER TABLE "draft_team" ADD CONSTRAINT "draft_team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "draft_team_riders" ADD CONSTRAINT "draft_team_riders_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "draft_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "draft_team_riders" ADD CONSTRAINT "draft_team_riders_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "race_result" ADD CONSTRAINT "race_result_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "race_result" ADD CONSTRAINT "race_result_rider_id_fkey" FOREIGN KEY ("rider_id") REFERENCES "rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

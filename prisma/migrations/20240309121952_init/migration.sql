-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'break');

-- CreateEnum
CREATE TYPE "VideoCategory" AS ENUM ('official', 'cover', 'teaser', 'medley', 'radio', 'vlog', 'making', 'live', 'other', 'undefined');

-- CreateEnum
CREATE TYPE "PrivacyStatus" AS ENUM ('public', 'unlisted', 'private', 'undefined');

-- CreateEnum
CREATE TYPE "LiveBroadcastContent" AS ENUM ('live', 'upcoming', 'none');

-- CreateEnum
CREATE TYPE "OrganizationCategory" AS ENUM ('campany', 'bandMembers', 'artistGroup', 'undefined');

-- CreateEnum
CREATE TYPE "Threads" AS ENUM ('active', 'inactive', 'notExist', 'undefined');

-- CreateTable
CREATE TABLE "Person" (
    "id" UUID NOT NULL,
    "status" "Status" NOT NULL,
    "birthday" TIMESTAMP(3),
    "searchName" TEXT NOT NULL,
    "homepage" TEXT,
    "ignoreBirthdayYear" BOOLEAN NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XTwitterAccount" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "XTwitterAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramAccount" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" TEXT,
    "personId" TEXT,
    "organizationId" TEXT,
    "userName" TEXT NOT NULL,
    "threads" "Threads" NOT NULL,

    CONSTRAINT "InstagramAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouTubeAccount" (
    "id" VARCHAR(24) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,
    "thumbnailsMediumUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" BOOLEAN NOT NULL,
    "officialArtistChannel" BOOLEAN,
    "unsubscribedTrailerVideoId" VARCHAR(11),
    "hiddenSubscriberCount" BOOLEAN NOT NULL,
    "subscriberCount" INTEGER NOT NULL,
    "viewCount" BIGINT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "userName" TEXT NOT NULL,
    "videoCountFromYTApi" INTEGER NOT NULL,

    CONSTRAINT "YouTubeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppleMusicArtist" (
    "id" VARCHAR(10) NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,
    "userName" TEXT NOT NULL,

    CONSTRAINT "AppleMusicArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokAccount" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "personId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "TikTokAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Name" (
    "id" UUID NOT NULL,
    "personId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "homePage" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "prganizationCategory" "OrganizationCategory" NOT NULL DEFAULT 'undefined',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" VARCHAR(11) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryChecked" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "viewCount" BIGINT NOT NULL,
    "commentCount" INTEGER NOT NULL,
    "start" INTEGER,
    "end" INTEGER,
    "description" TEXT NOT NULL,
    "karaokeKey" INTEGER,
    "musicTitle" TEXT NOT NULL,
    "musicArtist" TEXT NOT NULL,
    "subscriptionUrl" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "short" BOOLEAN,
    "searchText" TEXT NOT NULL,
    "actorChecked" BOOLEAN NOT NULL,
    "videoCategory" "VideoCategory" NOT NULL DEFAULT 'undefined',
    "category" INTEGER NOT NULL,
    "privacyStatus" "PrivacyStatus" NOT NULL,
    "liveBroadcastContent" "LiveBroadcastContent" NOT NULL DEFAULT 'none',
    "embeddable" BOOLEAN NOT NULL DEFAULT true,
    "likeCount" INTEGER,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingActor" (
    "personId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MainActor" (
    "personId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SubActor" (
    "personId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SecretActor" (
    "personId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StaffActor" (
    "personId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BelongHistory" (
    "id" UUID NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "leaveDate" TIMESTAMP(3),
    "personId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "BelongHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonToVideo" (
    "A" UUID NOT NULL,
    "B" VARCHAR(11) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_id_key" ON "Person"("id");

-- CreateIndex
CREATE UNIQUE INDEX "XTwitterAccount_id_key" ON "XTwitterAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "XTwitterAccount_userId_key" ON "XTwitterAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "XTwitterAccount_userName_key" ON "XTwitterAccount"("userName");

-- CreateIndex
CREATE INDEX "XTwitterAccount_personId_idx" ON "XTwitterAccount"("personId");

-- CreateIndex
CREATE INDEX "XTwitterAccount_organizationId_idx" ON "XTwitterAccount"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramAccount_id_key" ON "InstagramAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramAccount_userId_key" ON "InstagramAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramAccount_userName_key" ON "InstagramAccount"("userName");

-- CreateIndex
CREATE INDEX "InstagramAccount_personId_idx" ON "InstagramAccount"("personId");

-- CreateIndex
CREATE INDEX "InstagramAccount_organizationId_idx" ON "InstagramAccount"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeAccount_id_key" ON "YouTubeAccount"("id");

-- CreateIndex
CREATE INDEX "YouTubeAccount_personId_idx" ON "YouTubeAccount"("personId");

-- CreateIndex
CREATE INDEX "YouTubeAccount_organizationId_idx" ON "YouTubeAccount"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "AppleMusicArtist_id_key" ON "AppleMusicArtist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AppleMusicArtist_userName_key" ON "AppleMusicArtist"("userName");

-- CreateIndex
CREATE INDEX "AppleMusicArtist_personId_idx" ON "AppleMusicArtist"("personId");

-- CreateIndex
CREATE INDEX "AppleMusicArtist_organizationId_idx" ON "AppleMusicArtist"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_id_key" ON "TikTokAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_userId_key" ON "TikTokAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_userName_key" ON "TikTokAccount"("userName");

-- CreateIndex
CREATE INDEX "TikTokAccount_organizationId_idx" ON "TikTokAccount"("organizationId");

-- CreateIndex
CREATE INDEX "TikTokAccount_personId_idx" ON "TikTokAccount"("personId");

-- CreateIndex
CREATE INDEX "Name_personId_idx" ON "Name"("personId");

-- CreateIndex
CREATE INDEX "Name_organizationId_idx" ON "Name"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_id_key" ON "Organization"("id");

-- CreateIndex
CREATE INDEX "Organization_parentId_idx" ON "Organization"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- CreateIndex
CREATE INDEX "Video_channelId_idx" ON "Video"("channelId");

-- CreateIndex
CREATE INDEX "SingActor_personId_idx" ON "SingActor"("personId");

-- CreateIndex
CREATE INDEX "SingActor_videoId_idx" ON "SingActor"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "SingActor_personId_videoId_key" ON "SingActor"("personId", "videoId");

-- CreateIndex
CREATE INDEX "MainActor_personId_idx" ON "MainActor"("personId");

-- CreateIndex
CREATE INDEX "MainActor_videoId_idx" ON "MainActor"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "MainActor_personId_videoId_key" ON "MainActor"("personId", "videoId");

-- CreateIndex
CREATE INDEX "SubActor_personId_idx" ON "SubActor"("personId");

-- CreateIndex
CREATE INDEX "SubActor_videoId_idx" ON "SubActor"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "SubActor_personId_videoId_key" ON "SubActor"("personId", "videoId");

-- CreateIndex
CREATE INDEX "SecretActor_personId_idx" ON "SecretActor"("personId");

-- CreateIndex
CREATE INDEX "SecretActor_videoId_idx" ON "SecretActor"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "SecretActor_personId_videoId_key" ON "SecretActor"("personId", "videoId");

-- CreateIndex
CREATE INDEX "StaffActor_personId_idx" ON "StaffActor"("personId");

-- CreateIndex
CREATE INDEX "StaffActor_videoId_idx" ON "StaffActor"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffActor_personId_videoId_key" ON "StaffActor"("personId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "BelongHistory_id_key" ON "BelongHistory"("id");

-- CreateIndex
CREATE INDEX "BelongHistory_personId_idx" ON "BelongHistory"("personId");

-- CreateIndex
CREATE INDEX "BelongHistory_organizationId_idx" ON "BelongHistory"("organizationId");

-- CreateIndex
CREATE INDEX "_OrganizationToPerson_B_index" ON "_OrganizationToPerson"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToPerson_AB_unique" ON "_OrganizationToPerson"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToVideo_AB_unique" ON "_PersonToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToVideo_B_index" ON "_PersonToVideo"("B");

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domainType" TEXT NOT NULL,
    "domainTeam" TEXT NOT NULL,
    "domainHost" TEXT NOT NULL,
    "domainProvider" TEXT NOT NULL,
    "domainCloudflare" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WpDetail" (
    "id" TEXT NOT NULL,
    "domainUrl" TEXT NOT NULL,
    "wpUser" TEXT NOT NULL,
    "wpPassword" TEXT NOT NULL,

    CONSTRAINT "WpDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_url_key" ON "Domain"("url");

-- CreateIndex
CREATE UNIQUE INDEX "WpDetail_domainUrl_key" ON "WpDetail"("domainUrl");

-- AddForeignKey
ALTER TABLE "WpDetail" ADD CONSTRAINT "WpDetail_domainUrl_fkey" FOREIGN KEY ("domainUrl") REFERENCES "Domain"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

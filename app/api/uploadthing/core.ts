import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth(); // Await auth() to get userId

  if (!userId) {
    console.error("User not authenticated"); // Log for debugging
    throw new UploadThingError("User not authenticated"); // Custom error if user is not authenticated
  }

  return { userId };
};

// Define your FileRouter with endpoints that require authentication
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(({ metadata, file }) => {
      console.log("Server image upload complete:", file.url);
    }),

  messageFile: f(["image", "pdf"])
    .middleware(async () => await handleAuth())
    .onUploadComplete(({ metadata, file }) => {
      console.log("Message file upload complete:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
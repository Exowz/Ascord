"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  // Render uploaded image with a close button
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image 
          fill
          src={value}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onChange(undefined)}
          className="absolute top-0 right-0 p-1 bg-white rounded-full"
          aria-label="Remove uploaded file"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // Render the PDF icon if the file type is PDF
  if (value && fileType === "pdf") {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">PDF Uploaded</span>
        <button
          onClick={() => onChange(undefined)}
          className="p-1 bg-white rounded-full"
          aria-label="Remove uploaded PDF"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // Render UploadDropzone if no file is uploaded
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("Upload complete:", res);
        if (res && res[0]?.url) {
          onChange(res[0].url);
        } else {
          console.warn("No file URL returned from upload");
          onChange(); // Set to undefined if no URL is returned
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
    />
  );
};
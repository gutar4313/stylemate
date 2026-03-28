"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5";
import Image from "next/image";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  currentImageUrl?: string | null;
  label?: string;
}

export default function ImageUploader({ onImageSelect, currentImageUrl, label = "전신 사진 업로드" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      {preview ? (
        <div className="relative mx-auto w-fit">
          <Image
            src={preview}
            alt="업로드된 사진"
            width={200}
            height={300}
            className="rounded-xl border border-gray-200 object-cover"
            style={{ maxHeight: 300 }}
          />
          <button onClick={clearImage} className="absolute -top-2 -right-2 text-2xl text-red-500 hover:text-red-700">
            <IoCloseCircle />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-400"
          }`}
        >
          <input {...getInputProps()} />
          <IoCloudUploadOutline className="mb-2 text-4xl text-gray-400" />
          <p className="text-sm text-gray-500">{isDragActive ? "여기에 놓으세요" : "사진을 드래그하거나 클릭하여 업로드"}</p>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP (최대 10MB)</p>
        </div>
      )}
    </div>
  );
}

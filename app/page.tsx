"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Upload } from "lucide-react";
import NextImage from "next/image";

export default function Component() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const size = Math.max(img.width, img.height) + 30;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "white";
              ctx.fillRect(0, 0, size, size);
              const x = (size - img.width) / 2;
              const y = (size - img.height) / 2;
              ctx.drawImage(img, x, y, img.width, img.height);

              setImage(canvas.toDataURL());

              // Automatically download the image
              const link = document.createElement("a");
              link.href = canvas.toDataURL();
              link.download = "square-image.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      processImage(file);
    },
    [processImage],
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processImage(file);
      }
    },
    [processImage],
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    window.addEventListener("dragover", handleGlobalDragOver);
    window.addEventListener("dragleave", handleGlobalDragLeave);

    return () => {
      window.removeEventListener("dragover", handleGlobalDragOver);
      window.removeEventListener("dragleave", handleGlobalDragLeave);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 gap-6"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="flex gap-2 justify-center items-center">
        <div className="relative px-6">
          <NextImage
            src="/image1.png"
            alt="image"
            width={200}
            height={200}
            className="w-[100px] h-auto border-gray-200 border"
          />
          <span className="absolute block -top-[20px] left-1/2 translate-x-[-50%] text-sm">
            100
          </span>
          <span className="absolute block -left-0 top-1/2 translate-y-[-50%] text-sm">
            67
          </span>
        </div>
        <ArrowRight className="w-8 h-8" />
        <div className="relative px-6">
          <NextImage
            src="/image2.png"
            alt="image"
            width={200}
            height={200}
            className="w-[100px] h-auto border-gray-200 border"
          />
          <span className="absolute block -top-[20px] left-1/2 translate-x-[-50%] text-sm">
            100
          </span>
          <span className="absolute block -left-0 top-1/2 translate-y-[-50%] text-sm">
            100
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto relative shadow-lg">
        <CardContent className="p-6">
          <div
            onClick={openFileDialog}
            className={`border-2 border-dashed rounded-lg p-2 text-center cursor-pointer mb-4 transition-colors ${
              isDragging
                ? "border-blue-700 bg-blue-600/10"
                : "border-blue-600 hover:border-blue-700"
            }`}
          >
            {image ? (
              <img
                src={image}
                alt="Processed square image"
                className="max-w-full h-auto"
              />
            ) : (
              <div className="flex flex-col items-center gap-5 p-5">
                <Upload className="w-8 h-8 text-blue-700" />
                <p className="text-sm text-blue-800">
                  {isDragging
                    ? "Drop the image"
                    : "Drag and drop an image file here, or click to select a file"}
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept="image/*"
            className="hidden"
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </div>
  );
}

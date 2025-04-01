"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    onImagesSelected: (files: File[]) => void;
    hasError?: boolean;
    maxFiles?: number;
}

export default function ImageUploader({
    onImagesSelected,
    hasError = false,
    maxFiles = 5
}: ImageUploaderProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (imagePreviews.length + acceptedFiles.length > maxFiles) {
            return;
        }

        const imageUrls = acceptedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...imageUrls]);
        onImagesSelected(acceptedFiles);
    }, [onImagesSelected, imagePreviews.length, maxFiles]);

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        // Note: You might want to also update the parent's files array
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
        multiple: true,
        maxFiles,
        onDrop,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                    isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30",
                    hasError ? "border-destructive" : ""
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    {isDragActive ? (
                        <Upload className="w-8 h-8 text-primary" />
                    ) : (
                        <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    )}
                    <div className="space-y-1">
                        <p className="font-medium">
                            {isDragActive ? "Drop images here" : "Drag & drop images here"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {`Upload up to ${maxFiles} images (JPEG, PNG, WEBP)`}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                        >
                            Select Files
                        </Button>
                    </div>
                </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Selected Images ({imagePreviews.length}/{maxFiles})
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={src}
                                    alt={`Preview ${index}`}
                                    className="w-24 h-24 object-cover rounded-md border"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {hasError && (
                <p className="text-sm text-destructive">
                    Please upload at least one image
                </p>
            )}
        </div>
    );
}
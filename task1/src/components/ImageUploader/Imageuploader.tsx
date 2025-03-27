import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploaderProps {
    onImagesSelected: (files: File[]) => void;
}

export default function ImageUploader({ onImagesSelected }: ImageUploaderProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const imageUrls = acceptedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(imageUrls);
        onImagesSelected(acceptedFiles);
    }, [onImagesSelected]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        onDrop,
    });

    return (
        <div>
            <div {...getRootProps()} className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag & drop images here or click to select</p>
            </div>

            {/* Show Image Previews */}
            <div className="mt-4 flex gap-2 flex-wrap">
                {imagePreviews.map((src, index) => (
                    <img key={index} src={src} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded" />
                ))}
            </div>
        </div>
    );
}

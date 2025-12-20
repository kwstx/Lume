"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateAvatar } from "@/actions/user";

export function AvatarUploader({ currentImage, onUploadComplete }: { currentImage?: string | null, onUploadComplete?: (url: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("File must be an image");
            return;
        }

        setIsUploading(true);
        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;

                // Upload to server
                const result = await updateAvatar(base64String);

                if (result.success) {
                    toast.success("Avatar updated successfully!");
                    if (onUploadComplete) onUploadComplete(base64String);
                } else {
                    toast.error(result.error || "Failed to update avatar");
                }
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error("Something went wrong");
            setIsUploading(false);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileSelect}
            />
            <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 shadow-sm font-bold text-gray-600 h-9 px-5 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Change Avatar"}
            </Button>
        </>
    );
}

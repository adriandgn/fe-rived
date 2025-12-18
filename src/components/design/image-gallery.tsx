"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { DesignImage } from "@/lib/types";

interface ImageGalleryProps {
    images: DesignImage[];
    title: string;
    className?: string;
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
    // Sort images to put primary first, then others
    const sortedImages = [...images].sort((a, b) => (a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1));

    // Ensure we have at least one image or placeholder if empty array (handled by parent usually, but safe to check)
    // If no images, we can't show much, but let's assume valid data or handle gracefully.

    const [activeImage, setActiveImage] = useState<DesignImage | undefined>(sortedImages[0]);

    if (!images || images.length === 0) {
        return (
            <div className={cn("relative aspect-[3/4] bg-muted rounded-lg overflow-hidden flex items-center justify-center text-muted-foreground", className)}>
                No images available
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden shadow-sm border">
                {activeImage && (
                    <Image
                        src={getImageUrl(activeImage.url)}
                        alt={title}
                        fill
                        className="object-cover transition-all duration-300"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {sortedImages.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveImage(img)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                                activeImage?.id === img.id
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={getImageUrl(img.url)}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

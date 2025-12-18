"use client";

import { UploadCloud, X, File as FileIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    value?: File[];
    onChange: (files: File[]) => void;
    className?: string;
    disabled?: boolean;
    maxFiles?: number;
}

export function FileUpload({ value = [], onChange, className, disabled, maxFiles = 5 }: FileUploadProps) {
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        // Cleanup old previews to avoid memory leaks
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    // Sync previews with value changes
    useEffect(() => {
        const newPreviews = value.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // This effect might re-run too often if value reference changes. 
        // In a perfect world we map IDs, but File objects don't have stable IDs.
        // We rely on the parent to pass stable arrays or handle this simply.
        // To prevent flicker, we could just clear old ones. 
    }, [value]); // Simplification: Re-generating previews on every change is acceptable for small file counts.

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const currentFiles = value || [];
        const remainingSlots = maxFiles - currentFiles.length;

        if (acceptedFiles.length > remainingSlots) {
            toast.error(`You can only upload ${maxFiles} images in total.`);
            // Slice to fit remaining slots if we want to be nice, but rejection is clearer
            return;
        }

        const validFiles = acceptedFiles.filter(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error(`Skipped ${file.name}: Too large (Max 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            onChange([...currentFiles, ...validFiles]);
        }
    }, [value, maxFiles, onChange]);

    const removeFile = (index: number) => {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp'],
        },
        maxFiles: maxFiles,
        disabled,
        multiple: true
    });

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[160px] relative overflow-hidden bg-muted/5",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm font-medium">Click or drag images here</p>
                    <p className="text-xs text-muted-foreground/70">
                        PNG, JPG up to 5MB (Max {maxFiles} images)
                    </p>
                </div>
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {value.map((file, index) => (
                        <div key={index} className="relative aspect-square border rounded-lg overflow-hidden group bg-background shadow-sm">
                            {previews[index] ? (
                                <Image
                                    src={previews[index]}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                                    <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
                                </div>
                            )}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

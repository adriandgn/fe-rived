"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { Design, DesignImage } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";
import { FileUpload } from "./file-upload";
import { useQuery } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Piece, Style, Material } from "@/lib/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const editDesignSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description cannot exceed 5000 characters"),
    piece: z.string().min(1, "Please select a piece type"),
    styles: z.array(z.string()).min(1, "Please select at least one style"),
    materials: z.array(z.string()).min(1, "Please select at least one material"),
    files: z.array(z.instanceof(File))
        .optional()
        .refine((files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE), "Each file must be less than 5MB"),
});

type EditDesignValues = z.infer<typeof editDesignSchema>;

interface EditDesignFormProps {
    design: Design;
}

export function EditDesignForm({ design }: EditDesignFormProps) {
    const router = useRouter();
    const [existingImages, setExistingImages] = useState<DesignImage[]>(design.images || []);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const { data: options, isLoading: isLoadingOptions } = useQuery({
        queryKey: ["design-options"],
        queryFn: async () => {
            const res = await apiClient.get<{ pieces: Piece[], styles: Style[], materials: Material[] }>("/designs/options");
            return res.data;
        }
    });

    const form = useForm<EditDesignValues>({
        resolver: zodResolver(editDesignSchema),
        defaultValues: {
            title: design.title,
            description: design.description,
            piece: design.piece?.id || "",
            styles: design.styles?.map(s => s.id) || [],
            materials: design.materials?.map(m => m.id) || [],
            files: [],
        }
    });

    // Calculate how many more files can be added
    const remainingSlots = 5 - existingImages.length;

    const handleDeleteImage = async (imageId: string) => {
        if (existingImages.length <= 1) {
            toast.error("Cannot delete the last image of a design");
            return;
        }

        setIsDeleting(imageId);
        try {
            await apiClient.delete(`/designs/${design.id}/images/${imageId}`);
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            toast.success("Image removed");
        } catch (error: any) {
            console.error("Failed to delete image:", error);
            const detail = error?.response?.data?.detail;

            if (typeof detail === 'object' && detail?.code === "CANNOT_DELETE_LAST_IMAGE") {
                toast.error("Cannot delete the last image of a design");
            } else if (typeof detail === 'object' && detail?.message) {
                toast.error(detail.message);
            } else {
                toast.error("Failed to delete image");
            }
        } finally {
            setIsDeleting(null);
        }
    };

    const onSubmit = async (data: EditDesignValues) => {
        try {
            const payload = {
                title: data.title,
                description: data.description,
                piece_id: data.piece,
                style_ids: data.styles,
                material_ids: data.materials
            };

            // Step 1: Update Metadata (PUT)
            await apiClient.put(`/designs/${design.id}`, payload);

            // Step 2: Upload new images if any
            if (data.files && data.files.length > 0) {
                const uploadPromises = data.files.map((file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    return apiClient.post(`/designs/${design.id}/images`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                });
                await Promise.all(uploadPromises);
            }

            toast.success("Design updated successfully!");
            router.push(`/design/${design.id}`);
            router.refresh();

        } catch (error: any) {
            console.error("Update error:", error);

            // Handle Structured Errors (RFC 7807 inspired)
            const detail = error?.response?.data?.detail;

            if (typeof detail === 'object' && detail !== null && 'code' in detail) {
                switch (detail.code) {
                    case "FILE_TOO_LARGE":
                        toast.error("One or more files exceed the 5MB limit.");
                        break;
                    case "MAX_IMAGES_EXCEEDED":
                        toast.error("You cannot have more than 5 images total.");
                        break;
                    default:
                        toast.error(detail.message || "An error occurred");
                }
            } else if (typeof detail === 'string') {
                toast.error(detail);
            } else if (Array.isArray(detail)) {
                toast.error(detail[0]?.msg || "Validation error");
            } else {
                toast.error("Failed to update design. Please try again.");
            }
        }
    };

    if (isLoadingOptions) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                {/* Existing Images Management */}
                <div className="space-y-3">
                    <FormLabel>Current Images ({existingImages.length}/5)</FormLabel>

                    {existingImages.length === 0 ? (
                        <div className="p-4 border rounded-md bg-muted/30 text-center text-sm text-muted-foreground">
                            No images uploaded. Add some below.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative aspect-square border rounded-lg overflow-hidden group bg-background shadow-sm">
                                    <Image
                                        src={getImageUrl(img.url)}
                                        alt="Design image"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-6 w-6 rounded-full"
                                            onClick={() => handleDeleteImage(img.id)}
                                            disabled={!!isDeleting || existingImages.length <= 1}
                                        >
                                            {isDeleting === img.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                    {img.is_primary && (
                                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            Primary
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Add New Images</FormLabel>
                            <FormControl>
                                <FileUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={form.formState.isSubmitting || remainingSlots <= 0}
                                    maxFiles={remainingSlots}
                                />
                            </FormControl>
                            <FormDescription>
                                {remainingSlots > 0
                                    ? `You can add ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}.`
                                    : "Maximum limit of 5 images reached. Delete some to add more."
                                }
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="piece"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Piece Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a piece type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {options?.pieces.map((piece) => (
                                            <SelectItem key={piece.id} value={piece.id}>
                                                {piece.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="styles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Styles</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        options={options?.styles.map(s => ({ label: s.name, value: s.id })) || []}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select styles"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Materials</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={options?.materials.map(m => ({ label: m.name, value: m.id })) || []}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select materials"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4 border-t mt-8">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={form.formState.isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="min-w-[150px]" disabled={form.formState.isSubmitting || (existingImages.length === 0 && (!form.getValues().files || form.getValues().files?.length === 0))}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}

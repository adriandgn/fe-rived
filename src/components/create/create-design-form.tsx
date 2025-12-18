"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { FileUpload } from "./file-upload";
import { apiClient } from "@/lib/api-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createDesignSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description cannot exceed 5000 characters"),
    materials: z.string().min(1, "Please list at least one material").max(500, "Materials cannot exceed 500 characters"),
    files: z.array(z.instanceof(File))
        .min(1, "At least one image is required")
        .max(5, "Max 5 images allowed")
        .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), "Each file must be less than 5MB"),
});

type CreateDesignValues = z.infer<typeof createDesignSchema>;

export function CreateDesignForm() {
    const router = useRouter();
    const form = useForm<CreateDesignValues>({
        resolver: zodResolver(createDesignSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: "",
            files: [],
        }
    });

    const onSubmit = async (data: CreateDesignValues) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("materials", data.materials);

            // Append multiple images
            data.files.forEach((file) => {
                formData.append("images", file);
            });

            // Single atomic request
            const response = await apiClient.post("/designs/", formData, {
                headers: {
                    // Browser sets multipart/form-data with boundary automatically
                    // We just need to ensure we don't force application/json
                    'Content-Type': 'multipart/form-data',
                }
            });

            const designId = response.data.id;

            toast.success("Design created successfully!");
            router.push(`/design/${designId}`);
            router.refresh();

        } catch (error: any) {
            console.error("Creation failed:", error);

            // Handle Structured Errors (RFC 7807 inspired)
            const detail = error?.response?.data?.detail;

            if (typeof detail === 'object' && detail !== null && 'code' in detail) {
                switch (detail.code) {
                    case "MIN_IMAGES_REQUIRED":
                        toast.error("Please upload at least one image.");
                        break;
                    case "MAX_IMAGES_EXCEEDED":
                        toast.error("You cannot upload more than 5 images.");
                        break;
                    case "FILE_TOO_LARGE":
                        toast.error("One or more files exceed the 5MB limit.");
                        break;
                    default:
                        toast.error(detail.message || "An error occurred");
                }
            } else if (typeof detail === 'string') {
                toast.error(detail);
            } else if (Array.isArray(detail)) {
                toast.error(detail[0]?.msg || "Validation error");
            } else {
                toast.error("Failed to create design. Please try again.");
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Design Images</FormLabel>
                            <FormControl>
                                <FileUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={form.formState.isSubmitting}
                                    maxFiles={5}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload up to 5 clear images of your upcycled project.
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
                                <Input placeholder="e.g. Denim Jacket to Tote Bag" {...field} />
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
                                    placeholder="Tell the story of how you made this..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Materials Used</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Old Jeans, Thread, Patches (comma separated)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Publish Design
                </Button>
            </form>
        </Form>
    );
}

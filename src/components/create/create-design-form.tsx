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

const createDesignSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters"),
    materials: z.string().min(1, "Please list at least one material"),
    files: z.array(z.instanceof(File)).min(1, "At least one image is required").max(5, "Max 5 images allowed"),
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
            // Step 1: Create Design (JSON)
            const createRes = await apiClient.post("/designs/", {
                title: data.title,
                description: data.description,
                materials: data.materials
            });

            const designId = createRes.data.id;

            // Step 2: Upload Images (Multipart) in Parallel
            const uploadPromises = data.files.map((file, index) => {
                const formData = new FormData();
                formData.append("file", file);

                // If the API supports ordering or setting primary, we could add logic here.
                // Assuming first is primary or backend handles it.
                return apiClient.post(`/designs/${designId}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });

            await Promise.all(uploadPromises);

            toast.success("Design created successfully!");
            router.push(`/design/${designId}`);
            router.refresh();

        } catch (error: any) {
            console.error("Upload error:", error);
            const msg = error?.response?.data?.detail
                ? (Array.isArray(error.response.data.detail)
                    ? error.response.data.detail[0]?.msg
                    : error.response.data.detail)
                : "Failed to create design. Please try again.";
            toast.error(msg);
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

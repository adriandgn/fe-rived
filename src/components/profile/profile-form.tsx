"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { Profile } from "@/lib/types";
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

const profileFormSchema = z.object({
    full_name: z.string().max(50).optional(),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
    user: Profile;
    onUpdate: (updatedProfile: Profile) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            full_name: user?.full_name || "",
            bio: user?.bio || "",
            website: user?.website || "",
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const res = await apiClient.put<Profile>("/profiles/me", {
                full_name: data.full_name,
                bio: data.bio,
                website: data.website || undefined, // Send undefined if empty string
            });

            toast.success("Profile updated successfully");
            onUpdate(res.data);
            form.reset({
                full_name: res.data.full_name || "",
                bio: res.data.bio || "",
                website: res.data.website || "",
            });
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error("Failed to update profile");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto md:mx-0">
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your name as it appears on your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="flex justify-between">
                                <span>Brief description for your profile.</span>
                                <span>{field.value?.length || 0}/160</span>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-start">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}

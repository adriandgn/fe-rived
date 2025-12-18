"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { apiClient } from "@/lib/api-client";
import { Comment, PaginatedResponse } from "@/lib/types";
import { useAuthStore } from "@/store/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface CommentsSectionProps {
    designId: string;
    initialComments?: Comment[];
}

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500),
});

type CommentValues = z.infer<typeof commentSchema>;

async function fetchComments(designId: string) {
    const res = await apiClient.get<Comment[]>(`/designs/${designId}/comments`);
    // Handle both array and paginated response just in case, and map 'user' to 'author' if needed
    const items = Array.isArray(res.data) ? res.data : (res.data as any).items || [];

    return items.map((item: any) => ({
        ...item,
        author: item.author || item.user || { username: 'Unknown', avatar_url: '' }
    }));
}

export function CommentsSection({ designId, initialComments }: CommentsSectionProps) {
    const { user, isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery({
        queryKey: ["comments", designId],
        queryFn: () => fetchComments(designId),
        initialData: initialComments,
        staleTime: initialComments ? 30000 : 0,
    });

    const form = useForm<CommentValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: { content: "" },
    });

    const mutation = useMutation({
        mutationFn: async (data: CommentValues) => {
            await apiClient.post(`/designs/${designId}/comments`, data);
        },
        onMutate: async (newComment) => {
            await queryClient.cancelQueries({ queryKey: ["comments", designId] });
            const previousComments = queryClient.getQueryData<Comment[]>(["comments", designId]);

            // Optimistic update
            const mockComment: Comment = {
                id: Math.random().toString(),
                content: newComment.content,
                created_at: new Date().toISOString(),
                user_id: user?.id || "temp",
                design_id: designId,
                author: {
                    id: user?.id || "temp",
                    username: user?.first_name || "Me", // Fallback if fullname/username varies
                    avatar_url: user?.avatar_url,
                }
            };

            // Provide a safer fallback if previousComments is undefined
            queryClient.setQueryData<Comment[]>(["comments", designId], (old = []) => [mockComment, ...old]);

            return { previousComments };
        },
        onError: (err, newComment, context) => {
            queryClient.setQueryData(["comments", designId], context?.previousComments);
            toast.error("Failed to post comment");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", designId] });
            form.reset();
        },
    });

    const onSubmit = (data: CommentValues) => {
        if (!isAuthenticated) {
            toast.error("Please login to comment");
            return;
        }
        mutation.mutate(data);
    };

    return (
        <div id="comments-section" className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
            </h3>

            {isAuthenticated ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                        <Avatar className="h-10 w-10 hidden md:block">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add a comment..."
                                                className="min-h-[80px] resize-none"
                                                {...field}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        form.handleSubmit(onSubmit)();
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" size="sm" disabled={mutation.isPending}>
                                    {mutation.isPending ? "Posting..." : <><Send className="h-3 w-3 mr-2" /> Post Comment</>}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            ) : (
                <div className="bg-muted p-4 rounded-lg text-center text-sm text-muted-foreground">
                    Please <Button variant="link" className="p-0 h-auto font-semibold">login</Button> to leave a comment.
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-4">Loading comments...</div>
                ) : comments?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">Be the first to comment!</div>
                ) : (
                    comments?.map((comment: Comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src={comment.author?.avatar_url} />
                                <AvatarFallback>{comment.author?.username?.substring(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-sm">{comment.author?.username}</span>
                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                                </div>
                                <p className="text-sm mt-1 text-foreground/90 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

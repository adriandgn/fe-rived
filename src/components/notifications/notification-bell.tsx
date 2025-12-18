"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { Notification, PaginatedResponse } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-item";

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    // Poll for unread count
    const { data: countData } = useQuery({
        queryKey: ["notifications-count"],
        queryFn: async () => {
            const res = await apiClient.get<{ count: number }>("/notifications/unread-count");
            return res.data;
        },
        staleTime: Infinity,
        retry: false,
    });

    // Infinite Query for Notifications
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["notifications-list"],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await apiClient.get<PaginatedResponse<Notification>>("/notifications", {
                params: {
                    skip: pageParam,
                    limit: 10
                }
            });
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextSkip = allPages.length * 10;
            return nextSkip < lastPage.total ? nextSkip : undefined;
        },
        staleTime: Infinity,
    });

    // Mark as read mutation with Optimistic Update
    const readMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.patch(`/notifications/${id}/read`);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["notifications-count"] });
            await queryClient.cancelQueries({ queryKey: ["notifications-list"] });

            // Optimistically decrease unread count
            const prevCount = queryClient.getQueryData<{ count: number }>(["notifications-count"]);
            if (prevCount) {
                queryClient.setQueryData(["notifications-count"], {
                    count: Math.max(0, prevCount.count - 1)
                });
            }

            // Optimistically mark as read in list
            queryClient.setQueryData<{ pages: PaginatedResponse<Notification>[] }>(["notifications-list"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        items: page.items.map(item =>
                            item.id === id ? { ...item, is_read: true } : item
                        )
                    }))
                };
            });

            return { prevCount };
        },
        onError: (err, id, context) => {
            if (context?.prevCount) {
                queryClient.setQueryData(["notifications-count"], context.prevCount);
            }
            queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
            toast.error("Failed to mark as read");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
        }
    });

    // Mark ALL as read mutation
    const readAllMutation = useMutation({
        mutationFn: async () => {
            await apiClient.patch("/notifications/read-all");
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notifications-count"] });
            await queryClient.cancelQueries({ queryKey: ["notifications-list"] });

            // Optimistically set count to 0
            queryClient.setQueryData(["notifications-count"], { count: 0 });

            // Optimistically mark all loaded items as read
            queryClient.setQueryData<{ pages: PaginatedResponse<Notification>[] }>(["notifications-list"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        items: page.items.map(item => ({ ...item, is_read: true }))
                    }))
                };
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
            toast.success("All notifications marked as read");
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
        }
    });

    const unreadCount = countData?.count || 0;
    const notifications = data?.pages.flatMap((page) => page.items) || [];

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-full")}>
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 border border-background px-1 text-[10px] font-medium text-white shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-primary hover:bg-primary/10 hover:text-primary font-medium"
                            onClick={() => readAllMutation.mutate()}
                            disabled={readAllMutation.isPending}
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                            <span className="mr-2 animate-spin">⚪</span> Loading...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                            <Bell className="h-10 w-10 text-muted-foreground/20 mb-3" />
                            <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">No new notifications</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onRead={(id) => readMutation.mutate(id)}
                                />
                            ))}

                            {hasNextPage && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full h-12 rounded-none border-t text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? "Loading more..." : "Load Older Notifications"}
                                </Button>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

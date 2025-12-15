"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
        refetchInterval: 30000,
        staleTime: 25000,
        enabled: false, // Disabled until backend endpoint is verified (404 fix)
        retry: false,
    });

    // Fetch actual notifications only when open
    const { data: notificationsData, refetch, isLoading } = useQuery({
        queryKey: ["notifications-list"],
        queryFn: async () => {
            const res = await apiClient.get<PaginatedResponse<Notification>>("/notifications", {
                params: { limit: 10 }
            });
            return res.data;
        },
        enabled: isOpen, // Only fetch when dropdown is open
    });

    // Mark as read mutation
    const readMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
        }
    });

    // Mark ALL as read mutation
    const readAllMutation = useMutation({
        mutationFn: async () => {
            await apiClient.patch("/notifications/read-all");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-list"] });
            toast.success("All notifications marked as read");
        }
    });

    const unreadCount = countData?.count || 0;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-full")}>
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-background border-2 border-background animate-pulse" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-primary hover:bg-primary/10"
                            onClick={() => readAllMutation.mutate()}
                            disabled={readAllMutation.isPending}
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                            Loading...
                        </div>
                    ) : notificationsData?.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                            <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="py-1">
                            {notificationsData?.items.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onRead={(id) => readMutation.mutate(id)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notificationsData?.items && notificationsData.items.length > 0 && (
                    <div className="p-2 border-t text-center">
                        <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                            View all activity
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

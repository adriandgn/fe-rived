"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, AlertCircle, AlertTriangle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/types";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const router = useRouter();

    const handleClick = () => {
        // Optimistically mark as read handled by parent/mutation
        if (!notification.is_read) {
            onRead(notification.id);
        }

        if (notification.link) {
            // Fix standard backend path /designs/ID to frontend /design/ID
            const targetLink = notification.link.replace('/designs/', '/design/');
            router.push(targetLink);
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "error":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case "warning":
                return <AlertTriangle className="h-4 w-4 text-amber-500" />; // Amber/Orange
            case "info":
                return <Info className="h-4 w-4 text-blue-500" />;
            case "system":
                return <Sparkles className="h-4 w-4 text-purple-600" />; // Purple Sparkle
            default:
                return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <DropdownMenuItem
            className={cn(
                "flex items-start gap-3 p-3 cursor-pointer focus:bg-accent border-b last:border-0",
                !notification.is_read ? "bg-blue-50/50 hover:bg-blue-50" : "bg-background"
            )}
            onClick={handleClick}
        >
            <div className="relative mt-1 shrink-0">
                <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-muted shadow-sm",
                    !notification.is_read && "ring-2 ring-background"
                )}>
                    {getIcon()}
                </div>
            </div>

            <div className="flex flex-col gap-1 text-sm flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <span className={cn("font-semibold text-xs", !notification.is_read ? "text-foreground" : "text-foreground/80")}>
                        {notification.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                </div>
                <div className={cn("text-xs leading-snug line-clamp-2", !notification.is_read ? "text-foreground/90 font-medium" : "text-muted-foreground")}>
                    {notification.message}
                </div>
            </div>

            {!notification.is_read && (
                <div className="mt-2 h-2 w-2 rounded-full bg-blue-600 shrink-0 self-center" />
            )}
        </DropdownMenuItem>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const router = useRouter();

    const handleClick = () => {
        onRead(notification.id);

        if (notification.reference_id) {
            router.push(`/design/${notification.reference_id}`);
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case "LIKE":
                return <Heart className="h-4 w-4 text-red-500 fill-current" />;
            case "COMMENT":
                return <MessageCircle className="h-4 w-4 text-blue-500" />;
            default:
                return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    const getMessage = () => {
        const senderName = notification.sender?.full_name || notification.sender?.username || "Someone";
        const designTitle = notification.metadata?.design_title || "your design";

        switch (notification.type) {
            case "LIKE":
                return <span><span className="font-semibold">{senderName}</span> liked your design "{designTitle}"</span>;
            case "COMMENT":
                return <span><span className="font-semibold">{senderName}</span> commented on "{designTitle}"</span>;
            case "SYSTEM":
                return <span>{notification.metadata?.message || "System Notification"}</span>;
            default:
                return <span>New interaction</span>;
        }
    };

    return (
        <DropdownMenuItem
            className={cn(
                "flex items-start gap-3 p-3 cursor-pointer focus:bg-accent",
                !notification.is_read && "bg-muted/50 font-medium"
            )}
            onClick={handleClick}
        >
            <div className="relative mt-1">
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={notification.sender?.avatar_url} />
                    <AvatarFallback>{notification.sender?.username?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                    {getIcon()}
                </div>
            </div>

            <div className="flex flex-col gap-1 text-sm">
                <div className="line-clamp-2 leading-snug">
                    {getMessage()}
                </div>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
            </div>

            {!notification.is_read && (
                <div className="ml-auto mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
        </DropdownMenuItem>
    );
}

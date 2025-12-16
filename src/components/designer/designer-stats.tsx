"use client";

import { Palette, Heart, Eye } from "lucide-react";

interface DesignerStatsProps {
    stats?: {
        total_designs: number;
        total_likes: number;
        total_views: number;
    };
    isLoading: boolean;
}

export function DesignerStats({ stats, isLoading }: DesignerStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    const items = [
        {
            label: "Designs",
            value: stats?.total_designs || 0,
            icon: Palette,
        },
        {
            label: "Likes Received",
            value: stats?.total_likes || 0,
            icon: Heart,
        },
        {
            label: "Total Views",
            value: stats?.total_views || 0,
            icon: Eye,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div key={item.label} className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm">
                        <Icon className="h-6 w-6 text-primary mb-2 opacity-80" />
                        <span className="text-2xl font-bold">{item.value}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

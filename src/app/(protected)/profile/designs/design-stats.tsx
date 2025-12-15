"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Design } from "@/lib/types";
import { Heart, Layers, MessageCircle } from "lucide-react";

interface DesignStatsProps {
    designs: Design[];
}

export function DesignStats({ designs }: DesignStatsProps) {
    const totalDesigns = designs.length;

    // Sum up likes safely
    const totalLikes = designs.reduce((acc, design) => {
        return acc + (design.stats?.likes || 0);
    }, 0);

    // Sum up comments safely if available
    const totalComments = designs.reduce((acc, design) => {
        return acc + (design.stats?.comments || 0);
    }, 0);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Designs</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalDesigns}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalLikes}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalComments}</div>
                </CardContent>
            </Card>
        </div>
    );
}

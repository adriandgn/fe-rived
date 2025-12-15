"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { Design, PaginatedResponse } from "@/lib/types";
import { useAuthStore } from "@/store/use-auth-store";
import { DesignStats } from "./design-stats";
import { DesignsTable } from "./designs-table";

async function fetchMyDesigns(userId: string) {
    const res = await apiClient.get<PaginatedResponse<Design>>(`/designs/?user_id=${userId}`);
    return res.data;
}

export default function MyDesignsPage() {
    const { user } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ["my-designs", user?.id],
        queryFn: () => fetchMyDesigns(user!.id),
        enabled: !!user?.id,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data?.items?.length) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2">No designs yet</h2>
                <p className="text-muted-foreground">Create your first design to see it here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Design Management</h1>

            <DesignStats designs={data.items} />
            <DesignsTable designs={data.items} />
        </div>
    );
}

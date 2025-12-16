"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Profile, PaginatedResponse, Design } from "@/lib/types";
import { DesignerHeader } from "@/components/designer/designer-header";
import { DesignerStats } from "@/components/designer/designer-stats";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { DesignCard } from "@/components/main/design-card";


// Fetch profile info by username
// Note: Assuming backend supports this. If not, we might need a search endpoint.
async function fetchProfileByUsername(username: string) {
    // Try standard REST pattern
    try {
        const res = await apiClient.get<Profile>(`/profiles/by-username/${username}`);
        return res.data;
    } catch (error) {
        // Fallback or specific error handling can go here
        throw error;
    }
}

// Fetch stats (Mocked or real)
async function fetchStats(id: string) {
    try {
        const res = await apiClient.get(`/profiles/${id}/stats`);
        return res.data;
    } catch (e) {
        return null; // Return null to indicate missing endpoint
    }
}

export default function DesignerPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.slug as string; // Maps to [slug] folder, but semantically it's the username

    const { data: profile, isLoading: isProfileLoading, isError } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => fetchProfileByUsername(username),
        enabled: !!username,
        retry: 1,
    });

    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ["profile-stats", profile?.id],
        queryFn: () => fetchStats(profile!.id),
        enabled: !!profile?.id,
    });

    // We will get the real design count from the infinite query
    const [totalDesigns, setTotalDesigns] = useState<number>(0);

    if (isProfileLoading) {
        return <div className="flex justify-center py-20">Loading designer...</div>;
    }

    if (isError || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <h1 className="text-2xl font-bold">Designer not found</h1>
                <p className="text-muted-foreground">Could not find user @{username}</p>
                <Button onClick={() => router.push("/")}>Go Home</Button>
            </div>
        );
    }

    // Merge backend stats with frontend calculations if needed
    const displayStats = {
        total_designs: Math.max(statsData?.total_designs || 0, totalDesigns),
        total_likes: statsData?.total_likes || 0,
        total_views: statsData?.total_views || 0,
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl space-y-12">

            {/* Navigation */}
            <div>
                <Button variant="ghost" className="-ml-4 text-muted-foreground" onClick={() => router.push('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
                </Button>
            </div>

            {/* Profile Header */}
            <DesignerHeader profile={profile} />

            {/* Stats Dashboard */}
            {/* We pass isLoading=false once profile is loaded because we default to 0s if stats endpoint fails */}
            <DesignerStats stats={displayStats} isLoading={isStatsLoading && !statsData} />

            <Separator />

            {/* Portfolio Grid */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Portfolio</h2>

                <div className="min-h-[400px]">
                    <MasonryGridOverride userId={profile.id} onTotalChange={setTotalDesigns} />
                </div>
            </div>
        </div>
    );
}

function MasonryGridOverride({ userId, onTotalChange }: { userId: string, onTotalChange: (total: number) => void }) {
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["designs", "user", userId], // Unique key
        queryFn: async ({ pageParam = 0 }) => {
            const res = await apiClient.get<PaginatedResponse<Design>>(`/designs/`, {
                params: {
                    user_id: userId,
                    skip: pageParam * 20,
                    limit: 20
                }
            });
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextSkip = allPages.length * 20;
            return nextSkip < lastPage.total ? allPages.length : undefined;
        },
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    // Update total count
    useEffect(() => {
        if (data?.pages[0]?.total !== undefined) {
            onTotalChange(data.pages[0].total);
        }
    }, [data?.pages, onTotalChange]);

    if (status === "pending") return <div className="text-center py-10">Loading portfolio...</div>;

    const designs = data?.pages.flatMap((page) => page.items) || [];

    if (designs.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No designs yet.</div>;
    }

    return (
        <div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {designs.map((design) => (
                    <DesignCard key={design.id} design={design} />
                ))}
            </div>
            <div ref={ref} className="h-10 flex items-center justify-center mt-8">
                {isFetchingNextPage && <div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full"></div>}
            </div>
        </div>
    );
}

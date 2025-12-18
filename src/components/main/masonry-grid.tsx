"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Design, PaginatedResponse } from "@/lib/types";
import { DesignCard } from "./design-card";
import Masonry from "react-masonry-css";
import { DesignCardSkeleton } from "./design-card-skeleton";

async function fetchDesigns({ pageParam = 0, queryKey }: any) {
    const [_, params] = queryKey;

    // Filter out undefined values
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const queryString = new URLSearchParams({
        skip: (pageParam * 20).toString(),
        limit: "20",
        ...cleanParams
    }).toString();

    const res = await apiClient.get<PaginatedResponse<Design>>(`/designs?${queryString}`);
    return res.data;
}

export function MasonryGrid() {
    const searchParams = useSearchParams();
    const { ref, inView } = useInView();

    const queryParams = {
        q: searchParams.get("q") || undefined,
        category: searchParams.get("category") || undefined,
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["designs", queryParams],
        queryFn: fetchDesigns,
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

    const designs = data?.pages.flatMap((page) => page.items) || [];
    const skeletons = Array.from({ length: 12 }, (_, i) => i); // 12 Skeletons for initial load/next page

    const breakpointColumnsObj = {
        default: 4,
        1023: 3,
        767: 2
    };

    // Initial Loading State
    if (status === "pending") {
        return (
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
            >
                {skeletons.map((i) => (
                    <DesignCardSkeleton key={`skeleton-${i}`} />
                ))}
            </Masonry>
        );
    }

    if (status === "error") {
        return <div className="text-center py-10 text-red-500">Error loading designs.</div>;
    }

    if (designs.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No designs found.</div>;
    }

    return (
        <div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
            >
                {designs.map((design, index) => (
                    <DesignCard key={design.id} design={design} priority={index < 4} />
                ))}

                {/* Append Skeletons when fetching next page */}
                {isFetchingNextPage && skeletons.map((i) => (
                    <DesignCardSkeleton key={`skeleton-next-${i}`} />
                ))}
            </Masonry>

            {/* Invisible element to watch for intersection, kept if we want to trigger earlier or standard way, 
                 but if we append skeletons, the observer might need to be at the bottom of them? 
                 Actually, usually we put the ref div at the very bottom. */}
            <div ref={ref} className="h-4 w-full" />
        </div>
    );
}

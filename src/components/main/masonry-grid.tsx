"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Design, PaginatedResponse } from "@/lib/types";
import { DesignCard } from "./design-card";

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

    const res = await apiClient.get<PaginatedResponse<Design>>(`/designs/?${queryString}`);
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

    if (status === "pending") {
        return <div className="text-center py-10">Loading feed...</div>;
    }

    if (status === "error") {
        return <div className="text-center py-10 text-red-500">Error loading designs.</div>;
    }

    const designs = data?.pages.flatMap((page) => page.items) || [];

    if (designs.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No designs found.</div>;
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

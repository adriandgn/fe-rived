import { FilterBar } from "@/components/main/filter-bar";
import { MasonryGrid } from "@/components/main/masonry-grid";
import { Suspense } from "react";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-6">
            <Suspense fallback={<div className="h-16 w-full animate-pulse bg-muted rounded-md mb-8"></div>}>
                <FilterBar />
            </Suspense>
            <Suspense fallback={<div className="h-96 w-full flex items-center justify-center">Loading feed...</div>}>
                <MasonryGrid />
            </Suspense>
        </div>
    );
}
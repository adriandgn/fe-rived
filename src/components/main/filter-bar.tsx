"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "all");

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters(searchTerm, category);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const updateFilters = useCallback((query: string, cat: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (query) params.set("q", query);
        else params.delete("q");

        if (cat && cat !== "all") params.set("category", cat);
        else params.delete("category");

        // Reset pagination on filter change usually handled by React Query key change
        router.push(`/?${params.toString()}`);
    }, [router, searchParams]);

    const handleCategoryChange = (val: string | null) => {
        // In base-ui or radiz, sometimes val can be inferred differently, 
        // but based on Shadcn Select, it's string. The error says string | null is expected by some new definition or strictness.
        // We force it to handle the string from SelectItem.
        setCategory(val || "");
        updateFilters(searchTerm, val || "");
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between sticky top-16 z-20 bg-background/95 backdrop-blur py-4">
            <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search designs, materials..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue>Category</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="home-decor">Home Decor</SelectItem>
                    </SelectContent>
                </Select>

                {/* Could add more filters here later */}
            </div>
        </div>
    );
}

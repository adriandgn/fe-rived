"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import { apiClient } from "@/lib/api-client";
import { Design } from "@/lib/types";
import { EditDesignForm } from "@/components/create/edit-design-form";

async function fetchDesign(id: string) {
    const res = await apiClient.get<Design>(`/designs/${id}`);
    return res.data;
}

export default function EditDesignPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: design, isLoading, error } = useQuery({
        queryKey: ["design", id],
        queryFn: () => fetchDesign(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-2xl font-bold">Design Not Found</h2>
                <p className="text-muted-foreground">The design you are trying to edit does not exist or you don't have permission.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Edit Design</h1>
                <p className="text-muted-foreground mt-2">
                    Update the details or replace the image of your project.
                </p>
            </div>

            <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
                <EditDesignForm design={design} />
            </div>
        </div>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Copy, Heart } from "lucide-react";
import { format } from "date-fns"; // Standard date formatting if available, or native
import { toast } from "sonner";

import { Design } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DesignsTableProps {
    designs: Design[];
}

export function DesignsTable({ designs }: DesignsTableProps) {
    const router = useRouter();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await apiClient.delete(`/designs/${deleteId}`);
            toast.success("Design deleted successfully");
            // Invalidate the query to refresh the list
            queryClient.invalidateQueries({ queryKey: ["my-designs"] });
        } catch (error: any) {
            console.error("Delete error:", error);
            if (error.response?.status === 403) {
                toast.error("You are not authorized to delete this design.");
            } else if (error.response?.status === 404) {
                toast.error("Design already deleted.");
                // Refresh anyway to remove from list
                queryClient.invalidateQueries({ queryKey: ["my-designs"] });
            } else {
                toast.error("Failed to delete design. Please try again.");
            }
        } finally {
            setDeleteId(null);
        }
    };

    const handleDuplicate = async (design: Design) => {
        try {
            toast.loading("Duplicating design...", { id: "duplicate-toast" });
            const res = await apiClient.post<Design>(`/designs/${design.id}/duplicate`);
            const newDesign = res.data;

            toast.dismiss("duplicate-toast");
            toast.success("Design duplicated successfully");

            // Redirect to edit page of the new design
            router.push(`/design/${newDesign.id}/edit`);
        } catch (error) {
            console.error("Duplicate error:", error);
            toast.dismiss("duplicate-toast");
            toast.error("Failed to duplicate design");
        }
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Materials</TableHead>
                            <TableHead>Stats</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {designs.map((design) => {
                            const primaryImage = design.images.find(img => img.is_primary) || design.images[0];
                            return (
                                <TableRow key={design.id}>
                                    <TableCell>
                                        <div className="relative h-16 w-16 rounded overflow-hidden bg-muted">
                                            {primaryImage ? (
                                                <Image
                                                    src={getImageUrl(primaryImage.url)}
                                                    alt={design.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium">{design.title}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                                {design.description}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(design.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {design.materials.split(',').slice(0, 3).map((mat, i) => (
                                                <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                                                    {mat.trim()}
                                                </Badge>
                                            ))}
                                            {design.materials.split(',').length > 3 && (
                                                <span className="text-[10px] text-muted-foreground">...</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Heart className="h-3 w-3 text-muted-foreground" />
                                            <span>{design.stats?.likes || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none transition-colors">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => router.push(`/design/${design.id}/edit`)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicate(design)}>
                                                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(design.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your design
                            and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

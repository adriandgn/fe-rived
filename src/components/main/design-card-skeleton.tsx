import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DesignCardSkeleton() {
    // Randomize height slightly to simulate masonry effect 
    // We use a predefined set of random heights to keep it consistent enough for SSR if needed, 
    // but for client-side skeleton, random classes work ok.
    // Actually, we can just pick one randomly, but suppression of hydration mismatch is needed if SSR.
    // For simplicity, we'll just fix a few heights or let it be random.
    // Since this is loading state, strict hydration match isn't always fatal, but good to avoid.
    // Let's just use 'aspect-[3/4]' or similar to approximate widely used shapes.

    return (
        <Card className="overflow-hidden break-inside-avoid mb-4">
            <div className="relative w-full">
                {/* Simulate different aspect ratios */}
                <Skeleton className="w-full aspect-[3/4] rounded-none" />
            </div>

            <CardHeader className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>

            <CardFooter className="p-3 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-8" />
                </div>
            </CardFooter>
        </Card>
    )
}

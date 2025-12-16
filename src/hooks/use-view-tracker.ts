import { useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * Hook to track a "Significant View" on a design.
 * 
 * Logic:
 * 1. Checks sessionStorage to see if already viewed in this session.
 * 2. Waits for `delayMs` (default 2000ms) to ensure user engagement.
 * 3. Fires API call and marks session as viewed.
 * 4. Cleans up timer if component unmounts before delay (bounces).
 */
export function useViewTracker(designId: string | undefined, delayMs = 2000) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // If no design ID or invalid format (prevent "create" or "edit" collisions)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!designId || !uuidRegex.test(designId)) return;

        const storageKey = `viewed_design_${designId}`;

        // 1. Deduping: Check session storage
        if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) {
            return;
        }

        // 2. Set timer for "Significant View"
        timerRef.current = setTimeout(async () => {
            try {
                // 3. Fire API
                await apiClient.post(`/designs/${designId}/view`);

                // 4. Mark as viewed
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem(storageKey, 'true');
                }
            } catch (error) {
                // Silently fail - analytics should not disrupt UX
                console.error("Failed to track view for design", designId, error);
            }
        }, delayMs);

        // Cleanup: Clear timer if user leaves page before threshold
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [designId, delayMs]);
}

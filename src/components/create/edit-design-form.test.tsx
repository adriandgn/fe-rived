
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditDesignForm } from './edit-design-form';
import { apiClient } from '@/lib/api-client';
import { Design } from '@/lib/types';

// Mocks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
    }),
}));

vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn().mockReturnValue({
        data: {
            pieces: [{ id: 'p1', name: 'Jacket', category: 'Tops' }],
            styles: [{ id: 's1', name: 'Modern', category: 'General' }],
            materials: [{ id: 'm1', name: 'Cotton', category: 'Fabric' }],
        },
        isLoading: false,
    }),
}));

vi.mock('@/lib/api-client', () => ({
    apiClient: {
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

const mockDesign: Design = {
    id: 'd1',
    title: 'Existing Design',
    description: 'Existing Description',
    piece: { id: 'p1', name: 'Jacket', category: 'Tops' },
    styles: [{ id: 's1', name: 'Modern', category: 'General' }],
    materials: [{ id: 'm1', name: 'Cotton', category: 'Fabric' }],
    created_at: '2023-01-01',
    user_id: 'u1',
    images: [{ id: 'img1', url: 'http://example.com/img1.jpg', is_primary: true }],
};

describe('EditDesignForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form with pre-filled values', () => {
        render(<EditDesignForm design={mockDesign} />);

        expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Design');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Existing Description');

        // Check for specific pre-filled values logic
        // Verify Piece Name is displayed?
        // Select trigger usuall shows the selected value label
        const jacketElements = screen.getAllByText('Jacket');
        expect(jacketElements.length).toBeGreaterThan(0);
        expect(jacketElements[0]).toBeInTheDocument();

        // MultiSelect badges should be visible
        expect(screen.getByText('Modern')).toBeInTheDocument();
        expect(screen.getByText('Cotton')).toBeInTheDocument();
    });

    it('submits form with updated values', async () => {
        (apiClient.put as any).mockResolvedValueOnce({ data: { ...mockDesign, title: 'Updated Title' } });

        render(<EditDesignForm design={mockDesign} />);

        // Change Title
        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Title' } });

        const submitBtn = screen.getByRole('button', { name: /save changes/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(apiClient.put).toHaveBeenCalledWith(`/designs/${mockDesign.id}`, expect.objectContaining({
                title: 'Updated Title',
                piece_id: 'p1', // Should remain same
                style_ids: ['s1'],
                material_ids: ['m1']
            }));
        });
    });
});

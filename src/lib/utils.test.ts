import { cn } from './utils'
import { describe, it, expect } from 'vitest'

describe('cn utility', () => {
    it('merges class names correctly', () => {
        expect(cn('w-0', 'h-0')).toBe('w-0 h-0')
    })
    it('handles conditional classes', () => {
        expect(cn('w-0', true && 'h-0', false && 'bg-red-500')).toBe('w-0 h-0')
    })
    it('resolves tailwind conflicts', () => {
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })
})

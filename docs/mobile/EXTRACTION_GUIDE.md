# Web-to-Mobile Asset Extraction Guide

Before initializing the new Mobile Repository, we recommend copying these key files from the existing Web Project (`fe-rived`). They will speed up development significantly.

## 1. The Design System (Must Have)
**Source:** `src/app/globals.css`
**Destination in Mobile:** `src/global.css` (NativeWind entry point)

**Why?** This file contains your custom `oklch` color palette and border radii variables.
*   *Action:* Copy the file content. You will need to wrap the `:root` variables in `@theme` block for NativeWind v4, but having the raw values is critical.

## 2. TypeScript Interfaces (High Value)
**Source:** `src/lib/types.ts`
**Destination in Mobile:** `src/types/domain.ts`

**Why?** Contains the shared data models including `Design`, `Profile`, and `User`.
*   *Action:* Copy file as-is. It is framework agnostic.

## 3. Validation Logic (High Value)
**Source:** `src/lib/schemas/auth.ts` (and others in that folder)
**Destination in Mobile:** `src/core/auth/schemas.ts`

**Why?** If you use Zod for form validation, reusing these ensures your mobile Login/Register forms utilize the exact same rules as the web.

## 4. Coding Standards (Critical for AI)
**Source:** `docs/08_NEW_DEFINITIONS.md`
**Destination in Mobile:** `docs/CODING_STANDARDS.md`

**Why?** Contains the project's **Naming Conventions** (kebab-case files) and **Git Commit** rules.
*   *Action:* Copy this file. It is essential for the AI Agent to generate code that matches your preferred style.

## Summary Checklist for Migration
When you create the new repo, make sure you have these reference files handy:
- [ ] `docs/mobile/*.md` (The Blueprint)
- [ ] `src/app/globals.css` (The Look)
- [ ] `src/lib/types.ts` (The Data)
- [ ] `docs/08_NEW_DEFINITIONS.md` (The Rules)

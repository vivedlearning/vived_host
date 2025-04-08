# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Commands
- Build: `npm run build` (runs both ESM and CJS builds)
- Test (watch mode): `npm test` 
- Test (single run): `npm run testOnce`
- Test (single file): `jest --config jestconfig.json path/to/file.test.ts`
- Lint: `npm run lint`
- Format: `npm run format`

## Code Style Guidelines
- **Architecture**: Uses AppObject Architecture (Entities, UCs, PMs, Controllers, Adapters)
- **Naming**: PascalCase for classes, camelCase for variables/functions, "I" prefix for interfaces
- **Files**: Match class name (PascalCase) or function name (camelCase); test files append `.test.ts`
- **Formatting**: Use tabs for indentation, curly braces on separate lines
- **Imports**: Group imports from external packages first, then internal modules
- **Types**: Always use proper TypeScript types, including for Memoized values
- **Error Handling**: Verify entity existence before accessing (`if (!this.entity) return`)
- **Class Structure**: Follow component types (Entity, UC, PM) patterns from copilot-instructions.md
- **Value Objects**: Use immutable value objects from @vived/core when appropriate
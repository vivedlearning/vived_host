# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Commands
- Build: `npm run build` (runs both ESM and CJS builds)
- Test (watch mode): `npm test` 
- Test (single run): `npm run testOnce`
- Test (single file): `jest --config jestconfig.json path/to/file.test.ts`
- Lint: `npm run lint`
- Format: `npm run format`

## Testing Guidelines
- **Unit Tests**: Place in the same directory as the file being tested, named `*.test.ts`
- **Integration Tests**: Place in `__tests__/integration/` folder of the feature module
  - Name integration test files with `.integration.ts` suffix (e.g., `featureName.integration.ts`)
  - Integration tests should verify interactions between multiple components
  - Document the components being tested in the integration test file's JSDoc
  - Create clear setup, execution, and verification phases in integration tests

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
- **Documentation**: Use JSDoc comments for interfaces, classes, and functions; document parameters, return types, and behavior
- **Method Style**: Use regular method syntax for class methods instead of arrow functions unless capturing `this` context
- **Return Types**: Always specify return types for functions explicitly (e.g., `function getName(): string`)
- **Parameter Types**: Always specify parameter types for functions explicitly
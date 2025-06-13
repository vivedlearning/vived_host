# @vived/host NPM Package

This TypeScript project creates the @vived/host NPM package, which serves as the foundation for hosting one or more VIVED App. It follows a Clean Architecture pattern with strict adherence to domain-driven design principles.

## Project Overview

- **Purpose**: Provide a robust hosting features for VIVED applications
- **Package**: Published as `@vived/host` to NPM
- **Architecture**: Based on Clean Architecture with Domain-Driven Design

## Dependencies and Setup

- Node.js 16+ required
- Install dependencies: `npm install`
- Build package: `npm run build`
- Test: `npm run test:once`

## File Naming Conventions

- For function files: Use **camelCase** (e.g., `sourceFileForAFunction.ts`)
- For class files: Use **PascalCase** (e.g., `SourceFileForAClass.ts`)
- Test files: Match source filename + `.test.ts` (e.g., `sourceFileForAFunction.test.ts`)

## Project Structure

- The `/src/FEATURE` folder contains source for each feature, organized into the Feature Folders. 
- Under each feature folder are subfolders that group the code into components
- Use the ExampleFeature in the Github Repo `vivedlearning/vived_core` as a reference on best practices
- All component types are defined in the Github Repo `vivedlearning/vived_core`

## Testing Guidelines:

- All files require corresponding test files with the exception of Mocks
- Follow the AAA pattern (Arrange-Act-Assert)
- Keep test organization flat (avoid nested `describe` blocks)
- Use meaningful test names that describe behavior
- When writing tests for an Adapter use a Mock PM from the Mocks folder
- When writing tests for a Controller use a Mock UC from the Mocks folder
- When writing tests for a PM do not mock any Entity
- When writing tests for a UC do not mock any Entity
- When writing tests for a UC use Mocks for other UCs

## Code Standards

- Use **PascalCase** for classes and interfaces (prefix interfaces with "I")
- Use **camelCase** for variables, functions, and parameters
- Prefix boolean variables with "is" or similar (e.g., `isLoaded`, `hasPermission`)
- Use tabs for indentation, not spaces
- Place curly braces on a separate line
- Include a single blank line between methods
- Minimize comments - code should be self-explanatory

### Required Before Each Commit
- Run `format` before committing any changes to ensure proper code formatting
- This will run gofmt on all Go files to maintain consistent style

## Build Commands

- Format code: `npm run format:all`
- Lint code: `npm run lint`
- Run all tests: `npm run test:once`
- Run integration tests: `npm run test:integration:once`
- Run single test: `npm run test:once "test name pattern"`
- Build: `npm run build`

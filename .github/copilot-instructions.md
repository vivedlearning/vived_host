# GitHub Copilot Instructions

This typescript project is used to create the NPM Host package named @vived/host. This package is used by other project that are built to be the host for one or more VIVED App.
## File Naming Conventions

- For function files: Use **camelCase** (e.g., `sourceFileForAFunction.ts`)
- For class files: Use **PascalCase** (e.g., `SourceFileForAClass.ts`)
- Test files: Match source filename + `.test.ts` (e.g., `sourceFileForAFunction.test.ts`)

## Project Structure

### High-Level Organization

- **Domain/**: Core application logic isolated from external dependencies
- **Frameworks/**: UI rendering, styling, and external service integration

### Domain Structure

Each feature folder contains these subfolders:

- **Entities/**: Core state and business objects
- **Adapters/**: Translation layers to external systems
- **Controllers/**: User input handlers that invoke Use Cases
- **PMs/**: Presentation Managers that transform entity data for views
- **UCs/**: Business logic and workflows
- **Factories/**: Creation logic for AppObjects and components
- **Mocks/**: Test helpers and mock implementations

## Component Patterns

Refer to `@vived/core/README.md` for detailed architecture and to `@vived/core/dist/esm/ExampleFeature` for implementation examples.

### Two Component Types

1. **Singleton Components**:

   - Global access via static `get(appObjects)` using `getSingletonComponent`
   - Self-register with `appObjects.registerSingleton(this)` in constructor
   - Access other singletons via `getCachedSingleton<T>(Type.type)`
   - Does not need to handle dispose

2. **Non-Singleton Components**:
   - Local to specific AppObjects
   - Access via static `get(appObj)` or `getById(id, appObjects)`
   - Local component access via `getCachedLocalComponent<T>(Type.type)`

## Development Practices

### Test-Driven Development

- All Domain files require corresponding test files (except Mocks and factories)
- Follow the AAA pattern (Arrange-Act-Assert)
- Keep test organization flat (avoid nested `describe` blocks)
- Test only implementation-specific functionality
- Use meaningful test names that describe behavior
- Minimize comments. The code should speak for itself
- When testing adapters use a Mock PM from the Mocks folder
- When testing controllers use a Mock UC from the Mocks folder
- When testing PMs do not mock the entities
- When testing UCs do not mock the entities. You use Mocks from the Mocks folder for other UCs

### Code Standards

- Use **PascalCase** for classes and interfaces (prefix interfaces with "I")
- Use **camelCase** for variables, functions, and parameters
- Prefix boolean variables with "is" or similar
- Use tabs for indentation, not spaces
- Place curly braces on a separate line
- Include a single blank line between methods
- Minimize comments. The code should speak for itself

### Component Implementation

- Define abstract classes with `.type` constant and abstract properties/methods
- Create factory functions that return concrete implementations
- Use `MemoizedBoolean`, `MemoizedString`, etc. for property change notification
- Clean up observers in `dispose()` method
- Validate dependencies and handle missing components gracefully
- Use immutable view models for presentation managers

For detailed examples of each component type, refer to:

1. `@vived/core/dist/esm/ExampleFeature/Entities` for entity examples
2. `@vived/core/dist/esm/ExampleFeature/PMs` for presentation manager examples
3. `@vived/core/dist/esm/ExampleFeature/UCs` for use case examples
4. `@vived/core/dist/esm/ExampleFeature/Adapters` for adapter examples
5. `@vived/core/dist/esm/ExampleFeature/Controllers` for controller examples
6. `@vived/core/dist/esm/ExampleFeature/Mocks` for mock examples

## Error Handling

- Use integrated logging with `this.warn()` and `this.error()`
- Return early if dependencies are missing
- Provide clear error messages with context

## Build Commands

- Format code: `npm run format:all`
- Lint code: `npm run lint`
- Run all tests: `npm run test:once`
- Run integration tests: `npm run test:integration:once`
- Run single test: `npm run test:once "test name pattern"`
- Build: `npm run build`
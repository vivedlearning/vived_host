# @vived/host

A comprehensive TypeScript package providing core components for hosting VIVED Learning applications.

## Overview

The `@vived/host` package delivers common AppObject components for VIVED Host applications. It functions as the foundation for applications that host VIVED Apps through our plugin architecture, providing infrastructure for app lifecycle management, asset handling, UI components, state management, and more.

## Installation

```bash
npm install @vived/host
```

This package has a peer dependency on `@vived/core` which must also be installed:

```bash
npm install @vived/core
```

## Key Features

- **App Lifecycle Management**: Load, start, stop, and update VIVED applications
- **Asset Management**: Create, edit, archive, and manage digital assets
- **Sandbox Environment**: Development environment with inspection tools
- **Dialog System**: UI components for alerts, confirmations, and user input
- **State Machine**: Manage application state transitions and persistence
- **Event Handling**: Dispatch and handle events between host and apps
- **Theme Support**: Light/dark theme management with consistent color schemes
- **ZSpace Integration**: Support for zSpace 3D hardware environments
- **Logging**: Error reporting and log management tools

## Architecture

This package follows the AppObject Architecture pattern with components organized by feature:

- **Entities**: Core business objects and data models
- **Use Cases (UCs)**: Business logic for operations and workflows
- **Presentation Managers (PMs)**: Bridge domain logic with UI components
- **Controllers**: Handle user inputs and direct operations
- **Adapters**: Interface between components and external systems

## Modules

The package includes the following key modules:

- **Apps**: App mounting, versioning, and lifecycle management
- **AppSandbox**: Dev tools, inspector integration, and isolated execution
- **Assets**: Asset creation, editing, archiving, and management
- **Dialog**: Alert, confirmation, spinner, and editor components
- **StateMachine**: State transitions, editing, and navigation capabilities
- **Dispatcher**: Event dispatching between host and apps
- **VivedAPI**: Backend service communication and authentication
- **ZSpaceHost**: 3D hardware integration support

## Usage Example

```typescript
import { 
  setupAppSandbox, 
  setupAssetsForSandbox,
  setupStateMachineForSandbox 
} from '@vived/host';
import { AppObjectRepo } from '@vived/core';

// Create app objects repository
const appObjects = new AppObjectRepo();

// Set up sandbox environment
setupAppSandbox(appObjects);
setupAssetsForSandbox(appObjects);
setupStateMachineForSandbox(appObjects);

// Configure and use components...
```

## Development

```bash
# Install dependencies
npm install

# Run tests (watch mode)
npm test

# Run tests (single run)
npm run testOnce

# Build package (ESM and CJS)
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## License

ISC

## Further Documentation

For more information about the AppObject Architecture and component patterns, please see the internal documentation.
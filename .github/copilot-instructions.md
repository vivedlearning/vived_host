# GitHub Copilot Instructions

This typescript project is used to create the NPM Host package named @vived/host. This package is used by other project that are built to be the host for one or more VIVED App.

## General Guidelines

### AppObject Architecture

- **Definition:** An AppObject is a container that bundles together components (Entities, Use Cases, PMs, etc.) for a specific piece of functionality.
- **Key Features:**
  - Not an Entity itself but implements observable behavior (by extending `ObservableEntity`).
  - An AppObject is instantiated at runtime with its components attached via composition.
- **Components:**
  - All domain scripts (Entities, Use Cases, PMs, etc.) extend a common base class (e.g., `AppObjectComponent`).
  - Examples:
    - Entities typically extend `AppObjectEntity`.
    - Use Cases typically extend `AppObjectUC`.
    - Presentation Managers typically extend `AppObjectPM`.
  - Only one instance of a given component type can be added to any AppObject.
- **Runtime Composition:**
  - An AppObject is created and its components are attached dynamically.
  - Adding or removing a component triggers notifications via the observer pattern.
- **Composition Advantages:**

  - **Separation of Concerns:** Each component manages its own logic independently.
  - **Modularity & Reuse:** The same component type can be used across multiple AppObjects.
  - **Maintainability:** Clear container-component relationships simplify workflow tracing.

  **Singleton Components**
  Some App Object Components are intended to be singletons, meaning only one instance exists across the entire App Object repository.

### Component Types

#### Entities

- **Role:** The foundation of the application, storing the core state and properties for a given feature.
- **Implementation Details:**

  - Typically implemented as abstract classes extending a base class (e.g., `AppObjectEntity`) to enforce a consistent interface.
  - Depend only on other Entities within the domain.
  - It cannot import or be dependent on Use Cases, Presentation Managers, Controller, or Adapters
  - Use the Observer Pattern so that other components (such as Presentation Managers or Use Case Hooks) can subscribe to property changes.
  - May employ an Abstract Factory Pattern to manage instantiation.

#### Entity Repositories

Entity Repositories manage collections of entities that are instantiated multiple times across different App Objects. For example, a group of CalloutEntities is managed with a CalloutRepo. Repositories typically include an injectable factory function (e.g., calloutFactory) that is responsible for creating new entity instances at runtime. The default factory provides basic functionality for testing, while at runtime, a more detailed factory is injected to handle production-specific requirements.

#### Use Cases (UCs)

- **Role:** Encapsulate specific business logic or workflows.

- **Responsibilities:**

  - Update one or more Entities.
  - Optionally trigger additional Use Cases if the business flow requires.
  - Remain free of framework dependencies.
  - **Implementation Details:**
  - Typically implemented as abstract classes extending a base class (e.g., `AppObjectUC`) to enforce a consistent interface.
  - Depend on other Entities or UCs within the domain.
  - It cannot import or be dependent on Presentation Managers, Controller, or Adapters
  - May employ an Abstract Factory Pattern to manage instantiation.
  - Usually includes a Mock to test any controller that call this UC

  #### Controllers

  - **Role:** Act as mediators between user interactions and domain logic.

- **Responsibilities:**
  - Listen to user actions (button clicks, text input, etc.) from the UI (Framework layer).
  - Determine which Use Case should be executed.
  - Pass input data to the Use Case and exit the flow.
    **Responsibilities:**
  - **Implementation Details:**
  - Typically a function
  - Depend on Entities or Use Cases
  - It cannot import or be dependent on Presentation Managers, Controller, or Adapters

#### Presentation Managers (PMs)

- **Role:** Bridge the domain with the View.
- **Responsibilities:**
  - Subscribe to Entities to receive state change notifications.
  - Construct view models that include only the data required by the UI.
  - Notify UI components (in the Framework layer) that an update is needed by passing along the view model.
- **Implementation Details:**
  - Typically implemented as abstract classes extending a base class (e.g., `AppObjectPM<VMType>`) where VMType is the type of the view model to enforce a consistent interface.
  - Depend on other Entities or Use Cases.
  - It cannot import or be dependent on Controller, or Adapters
  - May employ an Abstract Factory Pattern to manage instantiation.
  - Usually includes a Mock to test any adapters that are dependent on it

#### Adapters

- **Role:** Provides an simple interface between the View and Presentation Manager
- **Responsibilities:**
  - Provide a default view model for the View to use
  - Provide a function for the view to subscribe to the Presentation Manager
  - Provide a function for the view to unsubscribe from the Presentation Manager
- **Implementation Details:**
  - Typically a function
  - Depend on as single Presentation Manager
  - It cannot import or be dependent on Use Cases, Controller, or Adapters

### Component Lifecycle Example

1. At runtime a View subscribes to a Presentation Manager with an Adapter.
2. A Controller triggers a Use Case in response to a user action.
3. The Use Case updates one or more Entities.
4. The Entity notifies its observers of state changes.
5. Presentation Managers react by forming a new view model.
6. The view receives the new view model and updates itself.

### Abstract Factories for Entities, PMs and UCs

Entities, Presentation Managers (PMs), and Use Cases (UCs) are typically defined as abstract classes paired with a factory function that creates their concrete implementations. This pattern facilitates easy mocking during tests and supports interchangeable runtime implementations.

### Folder Structure Best Practices

- Organize the `src/` folder by **features**, with each feature residing in its own subfolder to ensure modularity and scalability.
- Each feature folder should include the following capitalized subfolders as applicable:
  - **Entities/**: Contains core business objects and data models.
  - **Adapters/**: Provides interfaces or translation layers to external systems or other domain modules.
  - **Controllers/**: Manages user inputs (e.g., button clicks, text inputs) and directs operations to the appropriate Use Cases.
  - **PMs/** (Presentation Managers): Bridges domain logic with the UI by observing Entities, forming view models, and notifying views.
  - **UCs/** (Use Cases): Encapsulates business logic for specific operations or workflows while updating Entities and triggering related Use Cases.
  - **Factories/**: Contains factories for creating and composing application objects.
  - **Mocks/**: Includes mock data or test helpers specific to the feature.
- Note: Depending on the complexity of the feature, some subfolders may be optional or combined.

## Style and Formatting

- Use PascalCase for Class names
- Use camelCase for variables and method parameters
- Use camelCase for functions
- Use the prefix “I” with Camel Casing for interfaces
- Do not use Hungarian notation to name variables.
- Use Meaningful, descriptive words to name variables. Do not use abbreviations.
- Prefix boolean variables, properties and methods with “is” or similar prefixes.
- File name should match with class or function name. For example, for the class HelloWorld, the file name should be HelloWorld.cs. If the function is helloWorld then the file name should be helloWorld.ts
- Use TAB for indentation. Do not use SPACES.
- Comments should be in the same level as the code (use the same level of indentation).
- Curly braces ( {} ) should be in the same level as the code outside the braces.
- Use one blank line to separate logical groups of code.
- There should be one and only one single blank line between each method inside the class.
- The curly braces should be on a separate line and not in the same line as if, for etc.
- Use a single space before and after each operator and brackets.

### File Naming

- If the source file defines a function use camelCase. For example: sourceFileForAFunction.ts
- If the source file defines a class use PascalCase. For example: SourceFileForAClass.ts
- All test files should be named exactly like the source file it is testing, appended with .test. For example, the test file for sourceFileForAFunction.ts should be named sourceFileForAFunction.test.ts and the test file for SourceFileForAClass.ts should be named SourceFileForAClass.test.ts

## @VIVED/Core Package

### Value Objects

Value Objects are immutable objects that represent concepts with no identity beyond their attributes. They are an essential part of the domain model and are defined in the `@vived/core` package.

#### Key Characteristics of Value Objects

1. **Immutability**: Value Objects are immutable; once created, they cannot be changed
2. **Equality by Value**: Two Value Objects are equal if all their properties are equal
3. **Self-Validation**: Value Objects validate their data upon creation
4. **No Identity**: Value Objects don't have an identity beyond their attributes
5. **Stateless Operations**: Operations on Value Objects return new instances

#### Common Value Objects

The framework provides several Value Object types to represent common concepts:

##### Vector Types

1. **Vector2** (`Vector2.ts`): Represents a 2D vector (x, y)

   - Used for 2D coordinates, sizes, and directions
   - Provides methods like `Add`, `Subtract`, `Scale`, and `Rotate`

2. **Vector3** (`Vector3.ts`): Represents a 3D vector (x, y, z)
   - Used for 3D coordinates, directions, and transformations
   - Includes helpers like `Zero()`, `One()`, `Forward()`, etc.
   - Operations include `Add`, `Subtract`, `Cross`, `Dot`, `Transform`, etc.

##### Geometric Value Objects

1. **Angle** (`Angle.ts`): Represents an angle with degree/radian conversion

   - Create with `Angle.FromDegrees()` or `Angle.FromRadians()`
   - Access via `.degrees` or `.radians` properties

2. **Quaternion** (`Quaternion.ts`): Represents 3D rotations

   - Create with methods like `FromYawPitchRoll()`, `FromEuler()`, or `FromAngleAxis()`
   - Efficient for 3D rotation calculations and interpolation

3. **Matrix** (`Matrix.ts`): Represents transformation matrices

   - 4x4 matrices for 3D transformations
   - Create with methods like `Compose()`, `Identity()`, or specialized functions
   - Extract components with `.scale`, `.rotation`, and `.translation` getters

4. **Rectangle** (`Rectangle.ts`): Represents a 2D rectangle
   - Defined by top, right, bottom, and left coordinates
   - Used for layout calculations

##### Geometric Calculations

1. **ParametricLine** (`ParametricLine.ts`): Represents a 3D line

   - Create with `FromTwoPoint()` or `FromPointDirection()`
   - Used for geometric calculations like intersections

2. **ParametricPlane** (`ParametricPlane.ts`): Represents a 3D plane

   - Create with `FromPointNormal()` or `FromThreePoints()`
   - Used for geometric calculations like line intersections

3. **LineSegment2D** (`LineSegment2D.ts`): Represents a 2D line segment
   - Offers methods for intersection detection and point calculations

##### Other Value Objects

1. **Color** (`Color.ts`): Represents RGB or RGBA color values

   - Create with `RGB()`, `RGBA()`, `Hex()`, or `X11()`
   - Access components as integers (0-255) or percentages (0-1)

2. **Version** (`Version.ts`): Represents semantic versioning
   - Handles comparisons between versions
   - Supports alpha, beta, and release stages

#### Using Value Objects in Components

Value Objects should be used in components to represent domain concepts with specific properties and behaviors. Here's how to use them effectively:

##### 1. Creation and Storage

```typescript
import {
  Vector3,
  Quaternion,
  Color,
  MemoizedVector3,
  MemoizedQuaternion,
  MemoizedColor
} from "@vived/core";

// In an entity
class ExampleEntityImp extends ExampleEntity {
  private memoizedPosition = new MemoizedVector3(
    Vector3.Zero(),
    this.notifyOnChange
  );
  private memoizedRotation = new MemoizedQuaternion(
    Quaternion.Identity(),
    this.notifyOnChange
  );
  private memoizedColor = new MemoizedColor(
    Color.RGB(255, 0, 0),
    this.notifyOnChange
  );

  get position(): Vector3 {
    return this.memoizedPosition.val;
  }

  set position(val: Vector3) {
    this.memoizedPosition.val = val;
  }

  // Repeat for rotation and color
}
```

##### Creating New Instances

When modifying a value object, always create and store a new instance:

```typescript
// WRONG - attempts to modify immutable object
const pos = this.position;
pos.x = 10; // This doesn't work! Vector3 is immutable

// RIGHT - creates a new Vector3
const newPos = new Vector3(10, this.position.y, this.position.z);
this.position = newPos;
```

##### Using Static Methods

Use static methods to create or manipulate Value Objects:

```typescript
// Creating from static constructors
const origin = Vector3.Zero();
const forward = Vector3.Forward();
const red = Color.RGB(255, 0, 0);

// Using static operations
const position = Vector3.Add(origin, forward);
const direction = Vector3.Subtract(targetPos, currentPos).unit;
const angle = Angle.FromDegrees(90);
const rotation = Quaternion.FromAngleAxis(Vector3.Up(), angle);
```

##### Using Data Transfer Objects (DTOs)

Value Objects support DTOs for serialization:

```typescript
// Converting to DTOs
const positionDTO = position.dto;
const colorDTO = color.dto;

// Creating from DTOs
const restoredPosition = Vector3.FromDTO(positionDTO);
const restoredColor = Color.FromDTO(colorDTO);
```

##### Equality Checks

Use static equality methods to compare Value Objects:

```typescript
// Checking equality
if (Vector3.Equal(position1, position2)) {
  // Handle equal positions
}

// Checking approximate equality
if (Vector3.Close(position1, position2, 0.001)) {
  // Handle positions that are close enough
}
```

#### Best Practices for Value Objects

1. **Always Use Provided Types**: Use the Value Object types from the framework rather than creating custom alternatives
2. **Treat as Immutable**: Never attempt to modify a Value Object; create a new one instead
3. **Use Memoization**: When storing in entities, use `MemoizedValue` to handle change notifications
4. **Use Static Helpers**: Prefer the static helper methods over creating your own operations
5. **Return New Instances**: When providing methods that modify Value Objects, always return new instances
6. **Use Type-Specific Operations**: Use type-specific operations (like `Vector3.Cross`) instead of generic operations
7. **Leverage DTO Support**: Use the `.dto` property and `FromDTO` static methods for serialization

By following these patterns, you'll maintain the integrity of Value Objects and leverage their benefits for clean, maintainable domain code.

### Memoized Value Classes for Entity State Management

The `@vived/core` package provides a set of Memoized value classes designed to efficiently manage entity state with automatic change notification. These classes are essential for implementing the Observer pattern in entities.

#### Purpose and Benefits

Memoized classes provide several key benefits:

1. **Automatic Change Detection**: Only notify observers when values actually change
2. **Consistent Change Notification**: Use the same notification mechanism for all properties
3. **Type Safety**: Each class is specialized for a specific value type
4. **Immutability Support**: Designed to work with immutable value objects

#### Available Memoized Classes

The following Memoized classes are available in the `@vived/core` package:

1. **MemoizedBoolean**: For boolean property values
2. **MemoizedNumber**: For numeric property values
3. **MemoizedString**: For string property values
4. **MemoizedAngle**: For Angle value objects
5. **MemoizedVector2**: For Vector2 value objects
6. **MemoizedVector3**: For Vector3 value objects
7. **MemoizedQuaternion**: For Quaternion value objects
8. **MemoizedColor**: For Color value objects

#### Common Pattern for Usage

All Memoized classes follow the same usage pattern:

```typescript
import {
  MemoizedBoolean,
  MemoizedString,
  MemoizedVector3,
  Vector3
} from "@vived/core";

class MyEntityImp extends MyEntity {
  // Create a memoized value for each property with a notifier callback
  private memoizedIsActive = new MemoizedBoolean(false, this.notifyOnChange);
  private memoizedName = new MemoizedString("", this.notifyOnChange);
  private memoizedPosition = new MemoizedVector3(
    Vector3.Zero(),
    this.notifyOnChange
  );

  // Property getters and setters
  get isActive(): boolean {
    return this.memoizedIsActive.val;
  }
  set isActive(val: boolean) {
    this.memoizedIsActive.val = val; // Automatically notifies when changed
  }

  get name(): string {
    return this.memoizedName.val;
  }
  set name(val: string) {
    this.memoizedName.val = val; // Automatically notifies when changed
  }

  get position(): Vector3 {
    return this.memoizedPosition.val;
  }
  set position(val: Vector3) {
    this.memoizedPosition.val = val; // Automatically notifies when changed
  }

  constructor(appObject: AppObject) {
    super(appObject, MyEntity.type);
    // Additional initialization if needed
  }
}
```

#### How Memoized Classes Work

Each Memoized class follows the same internal structure:

1. Stores the current value in a private field
2. Provides a `val` getter that returns the current value
3. Provides a `val` setter that:
   - Checks if the new value is different from the current value
   - If different, updates the stored value and calls the change callback
   - If the same, does nothing (avoiding unnecessary notifications)
4. Provides a `setValQuietly` method for setting the value without triggering the callback

#### Special Considerations for Value Objects

For value objects (Vector3, Quaternion, etc.), equality is determined using the appropriate static equality method:

```typescript
// Inside MemoizedVector3
set val(v: Vector3) {
  if (Vector3.Equal(v, this._val)) return;

  this._val = v;
  this.onChangeCallback();
}
```

This ensures that only meaningful changes trigger notifications, even when working with complex objects.

#### Best Practices for Working with Memoized Classes

1. **Always Use with notifyOnChange**: Pass `this.notifyOnChange` as the callback to ensure entity observers are notified
2. **Don't Mutate Values**: Especially for value objects, always create new instances rather than trying to modify the returned value
3. **Use Private Fields**: Keep memoized fields private to control access through getters and setters
4. **Initialize with Defaults**: Always provide sensible default values in the constructor
5. **Prefer Specific Classes**: Use the type-specific Memoized class rather than a generic approach
6. **Use setValQuietly When Appropriate**: For batch updates or initialization where notification is not needed
7. **Create Multiple Fields**: Use separate memoized fields for separate properties, don't try to combine them

#### Example: Setting Multiple Properties Efficiently

When you need to update multiple properties at once, you can prevent multiple notifications:

```typescript
// Use setValQuietly for intermediate updates
updatePositionAndRotation(position: Vector3, rotation: Quaternion) {
  this.memoizedPosition.setValQuietly(position);
  this.memoizedRotation.val = rotation; // Only this update will trigger notification
}
```

By using these Memoized classes consistently throughout your entities, you'll ensure efficient state management and notification while promoting clean, maintainable code.

### AppObjectRepo: The Component Registry

The `AppObjectRepo` class serves as the central registry for all AppObjects and singleton components in the application. It is provided by the `@vived/core` package and imported like other core components. Understanding how it works is crucial for implementing features correctly.

#### Role and Responsibilities

The AppObjectRepo has several key responsibilities:

1. **AppObject Management**: Create, retrieve, and dispose of AppObjects
2. **Singleton Component Registry**: Maintain a registry of singleton components accessible globally
3. **Error and Log Handling**: Provide centralized error and log collection

#### Creating and Accessing AppObjects

AppObjects are the foundational containers that hold components. They're created and accessed through the repository:

```typescript
// Creating a new AppObject (or retrieving an existing one with the same ID)
const appObject = appObjects.getOrCreate("some-unique-id");

// Getting an existing AppObject by ID
const existingObject = appObjects.get("existing-id");
```

When creating components that need their own AppObject, use a consistent ID pattern:

```typescript
// For sub-objects related to a parent
const childAppObjectId = `${parentId}_childPurpose`;
const childAppObject = appObjects.getOrCreate(childAppObjectId);
```

#### Singleton Component Management

Singleton components are registered with and retrieved from the repository:

```typescript
// Registering a singleton (called from the component's constructor)
this.appObjects.registerSingleton(this);

// Retrieving a singleton component
const singleton = appObjects.getSingleton<MyComponentType>(
  MyComponentType.type
);
```

The `getSingletonComponent` helper function simplifies retrieving singletons and is used in static getters:

```typescript
static get = (appObjects: AppObjectRepo): MyComponent | undefined =>
  getSingletonComponent(MyComponent.type, appObjects);
```

#### Error and Log Handling

The AppObjectRepo provides methods for consistent error reporting:

```typescript
// For informational messages
appObjects.submitLog("component-id", "Informational message");

// For warning conditions
appObjects.submitWarning("component-id", "Warning condition occurred");

// For error conditions
appObjects.submitError("component-id", "Error condition occurred");
```

Components inherit these methods through the AppObjectComponent base class, with automatic context:

```typescript
// From within a component
this.log("Informational message");
this.warn("Warning condition occurred");
this.error("Error condition occurred");
```

#### Testing with AppObjectRepo

When writing tests, you'll need to create a fresh AppObjectRepo:

```typescript
describe("My Component Tests", () => {
  let appObjects: AppObjectRepo;

  beforeEach(() => {
    // Create a fresh repository for each test
    appObjects = makeAppObjectRepo(); // ALWAYS use makeAppObjectRepo() factory function
  });

  it("should do something", () => {
    // Use appObjects to create components for testing
    const appObject = appObjects.getOrCreate("test-id");
    const component = makeMyComponent(appObject);

    // Test component behavior
  });
});
```

> **Important**: Always use the `makeAppObjectRepo()` factory function to create an AppObjectRepo instance. Never use `new AppObjectRepo()` directly, as the factory ensures proper initialization and configuration.

#### Best Practices for AppObjectRepo Usage

1. **Single Instance Per Application**: Maintain one AppObjectRepo instance for the entire application, created via `makeAppObjectRepo()`
2. **Consistent ID Generation**: Use clear, predictable patterns for AppObject IDs
3. **Dependency Injection**: Pass the AppObjectRepo to functions and components that need it
4. **Singleton Management**: Only register components as singletons when they truly represent global state
5. **Error Context**: Include clear component identification in error messages
6. **Object Disposal**: Properly dispose of AppObjects when they're no longer needed:

```typescript
// Disposing of an AppObject
appObject.dispose();
// Or from the repo
appObjects.dispose(appObjectId);
```

By understanding the AppObjectRepo and following these practices, you'll create components that integrate well with the application architecture and maintain proper lifecycle management.

### Component Architectural Components

The application is built on a foundational set of classes that establish the component architecture. These core components are provided by the `@vived/core` package and imported into the application code. Understanding these base classes is essential for creating new features.

#### The Component Hierarchy

The domain code is organized around a hierarchical component system:

1. **AppObjectComponent** (`AppObjectComponent.ts`): The base class for all components in the system.

   - Provides core functionality like component access, logging, and lifecycle management
   - Defines the component type through the `componentType` property
   - Includes utility methods for accessing other components with caching

Source code:
```typescript
import { AppObject } from "./AppObject";
import { AppObjectRepo } from "./AppObjectRepo";

export enum AppObjectComponentType {
  ENTITY = "Entity",
  PM = "Presentation Manager",
  UC = "Use Case",
  CONTROLLER = "Controller",
  VIEW = "View",
  UNKNOWN = "Unknown",
}

export class AppObjectComponent {
  readonly componentType: AppObjectComponentType = AppObjectComponentType.UNKNOWN;
  readonly type: string;
  readonly appObject: AppObject;
  get appObjects(): AppObjectRepo {
    return this.appObject.appObjectRepo;
  }

  private cachedComponents = new Map<string, AppObjectComponent>();
  getCachedSingleton<T extends AppObjectComponent>(
    type: string
  ): T | undefined {
    if (!this.cachedComponents.has(type)) {
      const component = this.appObjects.getSingleton(type);
      if (!component) {
        this.warn("Unable to get cached singleton type " + type);
      } else {
        this.cachedComponents.set(type, component);
      }
    }

    return this.cachedComponents.get(type) as T;
  }

  getCachedLocalComponent<T extends AppObjectComponent>(
    type: string
  ): T | undefined {
    if (!this.cachedComponents.has(type)) {
      const component = this.appObject.getComponent(type);

      if (!component) {
        this.warn("Unable to get local component of type " + type);
      } else {
        this.cachedComponents.set(type, component);
      }
    }

    return this.cachedComponents.get(type) as T;
  }

  getSingleton<T extends AppObjectComponent>(
    type: string,
    logType: "LOG" | "WARN" | "ERROR" = "WARN"
  ): T | undefined {
    const comp = this.appObjects.getSingleton<T>(type);

    if (!comp) {
      const msg = "Unable to get singleton type " + type;
      switch (logType) {
        case "ERROR":
          this.error(msg);
          break;
        case "LOG":
          this.log(msg);
          break;
        case "WARN":
          this.warn(msg);
          break;
      }
    }

    return comp;
  }

  dispose() {
    if (this.appObject.getComponent(this.type) === this) {
      this.appObject.removeComponent(this.type);
    }
  }

  log(message: string) {
    this.appObjects.submitLog(`${this.appObject.id}/${this.type}`, message);
  }

  warn(message: string) {
    this.appObjects.submitWarning(`${this.appObject.id}/${this.type}`, message);
  }

  error(message: string) {
    this.appObjects.submitError(`${this.appObject.id}/${this.type}`, message);
  }

  constructor(appObject: AppObject, type: string) {
    this.appObject = appObject;
    this.type = type;
    appObject.addComponent(this);
  }
}
```

2. **AppObjectEntity** (`AppObjectEntity.ts`): Extends `AppObjectComponent` for data storage

   - Implements the Observer pattern with `addChangeObserver`/`removeChangeObserver`
   - Manages the `notifyOnChange` method to inform observers of state changes
   - Includes dispose handling to clean up resources and observers

Source code:
```typescript
import { ObserverList } from "../Entities";
import { AppObject } from "./AppObject";
import { AppObjectComponent, AppObjectComponentType } from "./AppObjectComponent";

export type AppObjectEntityObserver = () => void;

export class AppObjectEntity extends AppObjectComponent {
  readonly componentType = AppObjectComponentType.ENTITY;
  
  private onDisposeObserverList = new ObserverList<void>();
  addOnDisposeObserver = (observer: AppObjectEntityObserver) => {
    this.onDisposeObserverList.add(observer);
  };
  removeOnDisposeObserver = (observer: AppObjectEntityObserver): void => {
    this.onDisposeObserverList.remove(observer);
  };

  private onChangeObserverList = new ObserverList<void>();
  addChangeObserver = (observer: AppObjectEntityObserver): void => {
    this.onChangeObserverList.add(observer);
  };
  removeChangeObserver = (observer: AppObjectEntityObserver): void => {
    this.onChangeObserverList.remove(observer);
  };

  notifyOnChange = () => {
    this.onChangeObserverList.notify();
  };

  dispose() {
    this.removeChangeObserver(this.appObject.notify);

    this.onDisposeObserverList.notify();
    this.onChangeObserverList.clear();
    this.onDisposeObserverList.clear();

    super.dispose();
  }

  constructor(appObject: AppObject, type: string) {
    super(appObject, type)
    
    this.addChangeObserver(appObject.notify);
  }
}
```

3. **AppObjectUC** (`AppObjectUC.ts`): Extends `AppObjectComponent` for business logic

   - Represents Use Cases that manipulate Entities
   - Focused on implementing specific application behaviors
   - Can be singleton (global) or instance-specific

Source code:
```typescript
import { AppObjectComponent, AppObjectComponentType } from "./AppObjectComponent";

export class AppObjectUC extends AppObjectComponent {
	readonly componentType = AppObjectComponentType.UC;
}
```

4. **AppObjectPM** (`AppObjectPM.ts`): Extends `AppObjectComponent` for presentation logic

   - Manages view models and UI state
   - Implements view subscription with `addView`/`removeView`
   - Includes the required `vmsAreEqual` method to determine when to update views
  
Source code:
```typescript
import { ObserverList } from "../Entities";
import { AppObjectComponent, AppObjectComponentType } from "./AppObjectComponent";

export abstract class AppObjectPM<T> extends AppObjectComponent {
  readonly componentType = AppObjectComponentType.PM;
  abstract vmsAreEqual(a: T, b: T): boolean;

  private _lastVM?: T;
  get lastVM(): T | undefined {
    return this._lastVM;
  }

  private observerList = new ObserverList<T>();

  addView(updateView: (vm: T) => void): void {
    this.observerList.add(updateView);

    if (this._lastVM !== undefined) {
      updateView(this._lastVM);
    }
  }

  removeView(updateView: (vm: T) => void): void {
    this.observerList.remove(updateView);
  }

  doUpdateView(vm: T) {
    if (this._lastVM && this.vmsAreEqual(this._lastVM, vm)) {
      return;
    }

    this._lastVM = vm;
    this.observerList.notify(vm);
  }

  dispose() {
    this.observerList.clear();
    if (this.appObject.getComponent(this.type) === this) {
      this.appObject.removeComponent(this.type);
    }
    super.dispose();
  }
}
```

5. **AppObjectEntityRepo** (`AppObjectEntityRepo.ts`): Extends `AppObjectEntity` for entity collections
   - Manages collections of related entities
   - Provides observer notifications when entities are added or removed
   - Implements standard repository operations like add, remove, and lookup

Source code:
```typescript
import { ObserverList } from "../Entities";
import { AppObjectEntity } from "./AppObjectEntity";

export class AppObjectEntityRepo<
  T extends AppObjectEntity
> extends AppObjectEntity {

  private entityLookup = new Map<string, T>();

  private onEntityAddedObservers = new ObserverList<T>();
  addEntityAddedObserver = (observer: (addedEntity: T) => void) => {
    this.onEntityAddedObservers.add(observer);
  };
  removeEntityAddedObserver = (observer: (addedEntity: T) => void): void => {
    this.onEntityAddedObservers.remove(observer);
  };

  private onEntityRemovedObservers = new ObserverList<T>();
  addEntityRemovedObserver = (observer: (removedEntity: T) => void) => {
    this.onEntityRemovedObservers.add(observer);
  };
  removeEntityRemovedObserver = (
    observer: (removedEntity: T) => void
  ): void => {
    this.onEntityRemovedObservers.remove(observer);
  };

  hasForAppObject = (appObjectID: string): boolean => {
    return this.entityLookup.has(appObjectID);
  };

  add(entity: T) {
    const existing = this.entityLookup.get(entity.appObject.id);
    if (existing) {
      existing.removeChangeObserver(this.notifyOnChange);
    }

    this.entityLookup.set(entity.appObject.id, entity);
    entity.addChangeObserver(this.notifyOnChange);
    this.notifyOnChange();
    this.onEntityAddedObservers.notify(entity);
  };

  removeForAppObject = (id: string) => {
    const existing = this.entityLookup.get(id);
    if (!existing) return;

    this.entityLookup.delete(id);
    existing.removeChangeObserver(this.notifyOnChange);
    this.notifyOnChange();
    this.onEntityRemovedObservers.notify(existing);
  };

  getForAppObject = (appObjectID: string): T | undefined => {
    return this.entityLookup.get(appObjectID);
  };

  getAll = (): T[] => {
    return Array.from(this.entityLookup.values());
  };
}
```

6. **SingletonPmAdapter<VM>**: An interface that makes it easy for a View to bind to a Singleton Presentation Manager
   - Defines a default VM
   - Subscribe provide a uniform way for the View to inject a callback (setVM) that will be notified when the PM changes
   - Unsubscribe allows the View to unregister it's setVM callback

Source code:
```typescript
export interface SingletonPmAdapter<VM> {
  defaultVM: VM;
  subscribe(appObjects: AppObjectRepo, setVM: (vm: VM) => void): void;
  unsubscribe(appObjects: AppObjectRepo, setVM: (vm: VM) => void): void;
}
```

7. **PmAdapter<VM>**: An interface that makes it easy for a View to bind to a Non-Singleton Presentation Manager
   - Defines a default VM
   - Subscribe provide a uniform way for the View to inject a callback (setVM) that will be notified when the PM changes
   - Unsubscribe allows the View to unregister it's setVM callback

Source code:
```typescript
export interface SingletonPmAdapter<VM> {
  defaultVM: VM;
  subscribe(
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: VM) => void
  ): void;
  unsubscribe(
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: VM) => void
  ): void;
}
```

#### Component Access Methods

The `AppObjectComponent` class provides two key methods for accessing other components:

```typescript
// For accessing singleton components
getCachedSingleton<T extends AppObjectComponent>(type: string): T | undefined {
  if (!this.cachedComponents.has(type)) {
    const component = this.appObjects.getSingleton(type);
    if (!component) {
      this.warn("Unable to get cached singleton type " + type);
    } else {
      this.cachedComponents.set(type, component);
    }
  }
  return this.cachedComponents.get(type) as T;
}

// For accessing components on the same AppObject
getCachedLocalComponent<T extends AppObjectComponent>(type: string): T | undefined {
  if (!this.cachedComponents.has(type)) {
    const component = this.appObject.getComponent(type);
    if (!component) {
      this.warn("Unable to get local component of type " + type);
    } else {
      this.cachedComponents.set(type, component);
    }
  }
  return this.cachedComponents.get(type) as T;
}
```

These methods should be used to create private getters in your component implementations:

```typescript
// Example of a getter for a singleton component
private get someGlobalEntity() {
  return this.getCachedSingleton<SomeGlobalEntity>(SomeGlobalEntity.type);
}

// Example of a getter for a local component
private get someLocalEntity() {
  return this.getCachedLocalComponent<SomeLocalEntity>(SomeLocalEntity.type);
}
```

#### Singleton Component Pattern

The `getSingletonComponent` function is used to implement the singleton pattern:

```typescript
// From getSingletonComponent.ts
export function getSingletonComponent<T extends AppObjectComponent>(
  type: string,
  appObjects: AppObjectRepo
): T | undefined {
  return appObjects.getSingleton<T>(type);
}
```

This function is typically used in the static getter of a singleton component:

```typescript
static get = (appObjects: AppObjectRepo): MySingletonComponent | undefined =>
  getSingletonComponent(MySingletonComponent.type, appObjects);
```

Components register themselves as singletons in their constructor:

```typescript
constructor(appObject: AppObject) {
  super(appObject, MySingletonComponent.type);
  this.appObjects.registerSingleton(this);
}
```

#### Logging and Error Handling

All components inherit logging methods from `AppObjectComponent`:

1. `log(message: string)`: For informational messages
2. `warn(message: string)`: For warning conditions
3. `error(message: string)`: For error conditions

These methods automatically include the component type and AppObject ID for context:

```typescript
warn(message: string) {
  this.appObjects.submitWarning(`${this.appObject.id}/${this.type}`, message);
}
```

Use these methods instead of direct console calls to ensure consistent error handling and logging.

#### Component Lifecycle Management

Components have a defined lifecycle that should be properly managed:

1. **Creation**: Components are created via factory functions and attached to an AppObject
2. **Registration**: The component is registered with the AppObject via `appObject.addComponent(this)`
3. **Usage**: The component operates and potentially interacts with other components
4. **Disposal**: When no longer needed, the component's `dispose()` method is called

The base `dispose()` method handles common cleanup tasks:

```typescript
// From AppObjectComponent.ts
dispose() {
  if (this.appObject.getComponent(this.type) === this) {
    this.appObject.removeComponent(this.type);
  }
}
```

Derived classes should extend this with their own cleanup unless they are a singleton:

```typescript
dispose(): void {
  // Component-specific cleanup
  this.someEntity?.removeChangeObserver(this.onEntityChange);

  // Call the parent dispose method
  super.dispose();
}
```

#### Best Practices for Component Development

1. **Type Constants**: Always define a static `type` constant with a unique string
2. **Proper Inheritance**: Extend the appropriate base class for your component type
3. **Observer Cleanup**: Always remove observers in the `dispose()` method
4. **Component Access**: Use cached getters to access other components
5. **Error Handling**: Use the built-in logging methods rather than console
6. **Immutable View Models**: Create new view model objects rather than mutating existing ones
7. **Abstract Class Pattern**: Define abstract classes with factory functions for concrete implementations
8. **Notification Optimization**: Only notify observers when state actually changes

By following these architectural patterns, you'll create components that integrate properly with the existing system and maintain the application's maintainability and performance.

## Documentation and Examples

### Example: Entity Observer Pattern

Below is an example of a typical entity observer pattern.

```typescript
import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  MemoizedString
} from "@vived/core";

export abstract class ExampleEntity extends AppObjectEntity {
  static readonly type = "ExampleEntityType";

  abstract get aStringProperty(): string;
  abstract set aStringProperty(val: string);

  abstract get aBoolProperty(): boolean;
  abstract set aBoolProperty(val: boolean);
}

export function makeExampleEntity(appObject: AppObject): ExampleEntity {
  return new ExampleEntityImp(appObject);
}

class ExampleEntityImp extends ExampleEntity {
  private memoizedIsAuthoring = new MemoizedString("", this.notifyOnChange);

  get aStringProperty() {
    return this.memoizedIsAuthoring.val;
  }

  set aStringProperty(val: string) {
    this.memoizedIsAuthoring.val = val;
  }

  private memoizedIsAuthoring = new MemoizedBoolean(false, this.notifyOnChange);

  get aBoolProperty() {
    return this.memoizedIsAuthoring.val;
  }

  set aBoolProperty(val: boolean) {
    this.memoizedIsAuthoring.val = val;
  }

  constructor(appObject: AppObject) {
    super(appObject, ExampleEntity.type);
  }
}
```

This example demonstrates the key observer architectural pattern

- Uses Memoized classes to store state and automatically trigger change notifications
- The `notifyOnChange` callback is passed to inform observers when values change

#### Testing Observer Pattern

When testing the observer pattern, you need to verify their specific their entity functionality. Here's a comprehensive test structure:

```typescript
import { makeAppObjectRepo } from "@vived/core";
import { ExampleEntity, makeExampleEntity } from "./ExampleEntity";

describe("ExampleEntity", () => {
  const testId = "test-app-object-id";
  const testString = "test string value";

  let appObjects = makeAppObjectRepo();
  let appObject = appObjects.getOrCreate(testId);
  let entity: ExampleEntity;

  beforeEach(() => {
    // Create a fresh repository and app object for each test
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);
    entity = makeExampleEntity(appObject);
  });

  it("should be created with empty aStringProperty property", () => {
    // Verify default values are set correctly
    expect(entity.aStringProperty).toBe("");
  });

  it("should store and retrieve aStringProperty property", () => {
    // Test property setter and getter
    entity.aStringProperty = testString;
    expect(entity.aStringProperty).toBe(testString);
  });

  it("should notify observers when aStringProperty changes", () => {
    // Create a mock observer
    const mockObserver = jest.fn();
    entity.addChangeObserver(mockObserver);

    // Change property value
    entity.aStringProperty = testString;
    // Verify observer was called
    expect(mockObserver).toHaveBeenCalledTimes(1);

    // Setting the same value should not trigger notification
    entity.aStringProperty = testString;
    expect(mockObserver).toHaveBeenCalledTimes(1);

    // Changing to a new value should trigger notification again
    entity.aStringProperty = "new value";
    expect(mockObserver).toHaveBeenCalledTimes(2);
  });

  it("should be created with empty bool property", () => {
    // Verify default values are set correctly
    expect(entity.aBoolProperty).toBe(false);
  });

  it("should store and retrieve bool property", () => {
    // Test property setter and getter
    entity.aBoolProperty = true;
    expect(entity.aBoolProperty).toBe(true);
  });

  it("should notify observers when aBoolProperty changes", () => {
    // Create a mock observer
    const mockObserver = jest.fn();
    entity.addChangeObserver(mockObserver);

    // Change property value
    entity.aBoolProperty = true;
    // Verify observer was called
    expect(mockObserver).toHaveBeenCalledTimes(1);

    // Setting the same value should not trigger notification
    entity.aBoolProperty = true;
    expect(mockObserver).toHaveBeenCalledTimes(1);

    // Changing to a new value should trigger notification again
    entity.aBoolProperty = false;
    expect(mockObserver).toHaveBeenCalledTimes(2);
  });
});
```

Key testing considerations for non-singleton entities:

1. **Property Testing**: Verify default values and property setters/getters work correctly
2. **Observer Pattern**: Test that observers are notified when properties change
3. **Optimization Testing**: Verify observers are not notified when properties don't change

### Example: Singleton Abstract Entity Class Implementation

Below is an example demonstrating an abstract entity class with a factory function and a singleton implementation:

```typescript
// Abstract class definition with a singleton pattern
import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent,
  MemoizedBoolean
} from "@vived/core";

export abstract class SingletonEntityExample extends AppObjectEntity {
  static readonly type = "SingletonEntityExampleType";

  abstract get aBoolProperty(): boolean;
  abstract set aBoolProperty(val: boolean);

  // Singleton getter - note the use of getSingletonComponent
  static get = (
    appObjects: AppObjectRepo
  ): SingletonEntityExample | undefined =>
    getSingletonComponent(SingletonEntityExample.type, appObjects);
}

// Factory function creating the concrete implementation
export function makeSingletonEntityExample(
  appObject: AppObject
): SingletonEntityExample {
  return new SingletonEntityExampleImp(appObject);
}

// Concrete implementation class (private to the module)
class SingletonEntityExampleImp extends SingletonEntityExample {
  private memoizedIsAuthoring = new MemoizedBoolean(false, this.notifyOnChange);
  get aBoolProperty() {
    return this.memoizedIsAuthoring.val;
  }

  set aBoolProperty(val: boolean) {
    this.memoizedIsAuthoring.val = val;
  }

  constructor(appObject: AppObject) {
    super(appObject, SingletonEntityExample.type);
    // Register as a singleton on construction
    this.appObjects.registerSingleton(this);
  }
}
```

The example above demonstrates key architectural patterns:

1. **Abstract Class Pattern**:

   - `SingletonEntityExample` is defined as an abstract class with abstract properties
   - The implementation details are hidden in the private `SingletonEntityExampleImp` class

2. **Factory Pattern**:

   - `makeSingletonEntityExample` is a factory function that creates instances of the concrete implementation
   - This pattern allows for easy mocking during tests

3. **Singleton Pattern**:

   - The static `get` method uses `getSingletonComponent` to retrieve the singleton instance
   - In the constructor, `this.appObjects.registerSingleton(this)` registers the instance as a singleton

4. 4. **No Dispose**:
   - The `Dispose` function is not used or tested.

#### Testing Singleton Entities

When testing singleton entities, there are specific patterns to verify both their singleton behavior and their entity functionality. Here's a typical test structure:

```typescript
import { AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  SingletonEntityExample,
  makeSingletonEntityExample
} from "./ExampleSingletonEntity";

describe("SingletonEntityExample", () => {
  let appObjects: AppObjectRepo;
  let entity: SingletonEntityExample;
  let registerSingletonSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a fresh AppObjectRepo for each test
    appObjects = makeAppObjectRepo();

    // Spy on the registerSingleton method to verify it's called
    registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

    // Create the entity using the factory function
    entity = makeSingletonEntityExample(appObjects.getOrCreate("test-entity"));
  });

  it("should register itself as a singleton", () => {
    // Verify that registerSingleton was called with the entity
    expect(registerSingletonSpy).toBeCalledWith(entity);
  });

  it("should be accessible through the static getter", () => {
    // Create a new AppObject
    appObjects.getOrCreate("another-object");

    // The singleton should be accessible from any AppObject
    const retrievedEntity = SingletonEntityExample.get(appObjects);

    // Verify we got the original entity
    expect(retrievedEntity).toBe(entity);
  });
});
```

Key testing considerations for singleton entities:

1. **Singleton Registration**: Verify the entity registers itself as a singleton
2. **Global Accessibility**: Test that the entity can be retrieved using the static getter
3. **Fresh Repository**: Create a new AppObjectRepo for each test to ensure isolation
4. **Spying on Methods**: Use Jest spies to verify internal methods are called as expected

These test patterns ensure singleton entities work correctly both as entities (with properties and observers) and as singletons (with global registration and accessibility).

### Example: Non-Singleton Entity Implementation

Below is an example demonstrating a non-singleton entity implementation:

```typescript
import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  MemoizedString
} from "@vived/core";

export abstract class ExampleEntity extends AppObjectEntity {
  static readonly type = "ExampleEntityUniqueType";

  // Non-singleton getter pattern - gets component from specific AppObject
  static get(appObj: AppObject): ExampleEntity | undefined {
    return appObj.getComponent<ExampleEntity>(this.type);
  }

  // Get component from a specific AppObject by ID
  static getById(
    id: string,
    appObjects: AppObjectRepo
  ): ExampleEntity | undefined {
    return appObjects.get(id)?.getComponent<ExampleEntity>(this.type);
  }

  // Helper method to add component if it doesn't exist
  static addIfMissing(appObj: AppObject): ExampleEntity {
    const existing = appObj.getComponent<ExampleEntity>(this.type);
    if (existing) {
      return existing;
    } else {
      return makeExampleEntity(appObj);
    }
  }
}

export function makeExampleEntity(appObject: AppObject): ExampleEntity {
  return new ExampleEntityImp(appObject);
}

class ExampleEntityImp extends ExampleEntity {
  constructor(appObject: AppObject) {
    super(appObject, ExampleEntity.type);
  }
}
```

This example demonstrates key differences from the singleton pattern:

1. **Component Access Pattern**:

   - Uses `get(appObj)` and `getById(id, appObjects)` instead of a singleton getter
   - Components are retrieved from specific AppObjects rather than globally

2. **Helper Methods**:

   - Includes `addIfMissing()` to create the component if it doesn't exist on the AppObject
   - This pattern is common for components that can be attached to multiple AppObjects

3. **No Singleton Registration**:

   - Unlike singletons, the constructor doesn't call `this.appObjects.registerSingleton(this)`
   - Multiple instances of this component type can exist across different AppObjects

#### Testing Non-Singleton Entities

When testing non-singleton entities, you need to verify both their component behavior and their specific non-singleton access patterns. Here's a comprehensive test structure:

```typescript
import { makeAppObjectRepo } from "@vived/core";
import { ExampleEntity, makeExampleEntity } from "./ExampleEntity";

describe("ExampleEntity", () => {
  const testId = "test-app-object-id";
  const testString = "test string value";

  let appObjects = makeAppObjectRepo();
  let appObject = appObjects.getOrCreate(testId);
  let entity: ExampleEntity;

  beforeEach(() => {
    // Create a fresh repository and app object for each test
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);
    entity = makeExampleEntity(appObject);
  });

  it("should be retrievable via static get method", () => {
    // Test the static get method for accessing by AppObject
    const retrieved = ExampleEntity.get(appObject);
    expect(retrieved).toBe(entity);
  });

  it("should be retrievable via static getById method", () => {
    // Test the static getById method for accessing by ID
    const retrieved = ExampleEntity.getById(testId, appObjects);
    expect(retrieved).toBe(entity);
  });

  it("should add new entity if missing with addIfMissing", () => {
    // Create a new app object without the entity
    const newAppObject = appObjects.getOrCreate("new-id");

    // Should create and add the entity
    const addedEntity = ExampleEntity.addIfMissing(newAppObject);
    expect(addedEntity).toBeDefined();
    expect(ExampleEntity.get(newAppObject)).toBe(addedEntity);
  });

  it("should return existing entity with addIfMissing", () => {
    // Should return the existing entity
    const existingEntity = ExampleEntity.addIfMissing(appObject);
    expect(existingEntity).toBe(entity);
  });
});
```

Key testing considerations for non-singleton entities:

1. **Component Access Methods**: Test static accessor methods like `get(appObj)` and `getById(id, appObjects)`
2. **Helper Methods**: Test utility methods like `addIfMissing()` for both creating new instances and returning existing ones
3. **Multiple Instances**: When relevant, test that multiple instances can coexist without interference
4. **AppObject Association**: Verify that entities are properly associated with their containing AppObjects

These test patterns ensure non-singleton entities work correctly both as entities (with properties and observers) and maintain proper component access patterns for non-singleton components.

### Example: Entity Repository Implementation

Entity repositories manage collections of related entities and provide centralized creation, access, and deletion functionality. Below is an example of a non-singleton entity repository:

```typescript
import {
  AppObject,
  AppObjectEntityRepo,
  AppObjectRepo,
  generateUniqueID
} from "@vived/core";
import { ExampleEntity, makeExampleEntity } from "./ExampleEntity";

// Define a type for the factory function
export type ExampleEntityFactory = (id: string) => ExampleEntity;

export abstract class ExampleRepo extends AppObjectEntityRepo<ExampleEntity> {
  static readonly type = "ExampleRepoUniqueType";

  // Injectable factory function
  abstract exampleEntityFactory: ExampleEntityFactory;

  // Creation and deletion methods
  abstract createExampleEntity(id?: string): ExampleEntity;
  abstract deleteExampleEntity(id: string): void;

  // Standard non-singleton getter
  static get(appObj: AppObject): ExampleRepo | undefined {
    return appObj.getComponent<ExampleRepo>(this.type);
  }

  // Get by ID pattern for non-singletons
  static getById(
    id: string,
    appObjects: AppObjectRepo
  ): ExampleRepo | undefined {
    return appObjects.get(id)?.getComponent<ExampleRepo>(this.type);
  }

  // Helper method to add the component if missing
  static addIfMissing(appObject: AppObject): ExampleRepo {
    const existing = appObject.getComponent<ExampleRepo>(ExampleRepo.type);
    if (existing) {
      return existing;
    } else {
      return makeExampleRepo(appObject);
    }
  }
}

// Factory function for the repo itself
export function makeExampleRepo(appObject: AppObject): ExampleRepo {
  return new ExampleRepoImp(appObject);
}

// Private implementation
class ExampleRepoImp extends ExampleRepo {
  // Implementation of entity creation
  createExampleEntity = (id: string | undefined): ExampleEntity => {
    const idToUse = id ?? generateUniqueID();
    const entity = this.exampleEntityFactory(idToUse);
    this.add(entity);
    return entity;
  };

  // Implementation of entity deletion
  deleteExampleEntity(id: string): void {
    const entity = this.getForAppObject(id);
    if (!entity) return;

    entity.appObject.dispose();
    this.removeForAppObject(id);
  }

  // Default factory implementation
  exampleEntityFactory = (id: string): ExampleEntity => {
    const ao = this.appObjects.getOrCreate(id);
    return makeExampleEntity(ao);
  };

  constructor(appObject: AppObject) {
    super(appObject, ExampleRepo.type);
  }
}
```

This example demonstrates key patterns for entity repositories:

1. **Repository Pattern**:

   - Extends `AppObjectEntityRepo<T>` with a specific entity type
   - Centralizes entity creation, access, and deletion in one place
   - Provides a clean API for working with collections of entities

2. **Factory Injection**:

   - Defines `ExampleEntityFactory` type for the creation function
   - Exposes the factory as a mutable property, allowing runtime injection
   - Provides a default implementation that creates entities using the standard factory

3. **Identity Management**:

   - Generates unique IDs when not explicitly provided (`generateUniqueID()`)
   - Maintains a lookup of entities by their AppObject ID

4. **Entity Lifecycle**:

   - `createExampleEntity()` handles entity creation and registration
   - `deleteExampleEntity()` properly cleans up both the entity and its registration
   - Inherits observer notification from `AppObjectEntityRepo` to notify when entities are added/removed

5. **Non-Singleton Pattern**:
   - Uses the standard component getter pattern for non-singletons
   - Provides helper methods like `addIfMissing()` for convenient access

Entity repositories are particularly useful when:

- You need to manage multiple instances of the same entity type
- You want centralized creation and deletion logic
- You need to iterate through or filter collections of related entities
- You want to provide a customizable factory for entity creation

### Example: Singleton Presentation Manager Implementation

Below is an example of a Presentation Manager that works with a singleton entity. Since it observes a Singleton Entity this Presentation Manager can also be a singleton:

```typescript
import { AppObject, AppObjectPM } from "@vived/core";
import { SingletonEntityExample } from "../Entities/SingletonEntityExample";

// Define an immutable view model interface
export interface ExampleVM {
  readonly isEnabled: boolean;
  readonly displayText: string;
}

export abstract class ExampleSingletonPM extends AppObjectPM<ExampleVM> {
  static readonly type = "ExampleSingletonPMType";

  // Define a default view model
  static readonly defaultVM: ExampleVM = {
    isEnabled: false,
    displayText: "Default Text"
  };

  // Standard static getter for the PM
  static get = (appObjects: AppObjectRepo): ExampleSingletonPM | undefined =>
    getSingletonComponent(ExampleSingletonPM.type, appObjects);
}

// Factory function to create the concrete implementation
export function makeExampleSingletonPM(
  appObject: AppObject
): ExampleSingletonPM {
  return new ExampleSingletonPMImp(appObject);
}

// Private implementation of the abstract PM
class ExampleSingletonPMImp extends ExampleSingletonPM {
  // Standard getter for a singleton
  private get exampleEntity() {
    return this.getCachedSingleton<SingletonEntityExample>(
      SingletonEntityExample.type
    );
  }

  // Required equality check method for view models
  vmsAreEqual(a: ExampleVM, b: ExampleVM): boolean {
    if (a.isEnabled !== b.isEnabled) return false;
    if (a.displayText !== b.displayText) return false;
    return true;
  }

  // Handler called when the entity changes
  private onEntityChange = (): void => {
    const entity = this.exampleEntity;

    if (!entity) {
      this.doUpdateView(ExampleSingletonPM.defaultVM);
      return;
    }

    // Create a new immutable view model based on entity state
    const newVM: ExampleVM = {
      isEnabled: entity.aBoolProperty,
      displayText: entity.aBoolProperty ? "Enabled" : "Disabled"
    };

    // Update the view with the new view model
    this.doUpdateView(newVM);
  };

  constructor(appObject: AppObject) {
    super(appObject, ExampleSingletonPM.type);

    // Subscribe to entity changes
    const entity = this.exampleEntity;
    if (entity) {
      entity.addChangeObserver(this.onEntityChange);
    }

    // Initialize the view model
    this.onEntityChange();
  }

  // Note, no dispose function
}
```

This example demonstrates key patterns for Presentation Managers:

1. **View Model Pattern**:

   - The `ExampleVM` interface defines an immutable object that will be passed to views
   - A default view model is provided as a fallback
   - The PM implements `vmsAreEqual()` to avoid unnecessary view updates

2. **Entity Observation**:

   - The PM observes changes in the entity via `addChangeObserver(this.onEntityChange)`
   - When entity state changes, the PM creates a new view model and updates views

3. **Abstract Class Pattern**:

   - As with entities, PMs use abstract classes with concrete implementations
   - The implementation (`ExampleSingletonPMImp`) is private to the module
   - A factory function creates the implementation

4. **State Transformation**:
   - The PM transforms entity state into view-specific data (`aBoolProperty` becomes `isEnabled` and `displayText`)
   - This isolates the view from changes in the underlying domain model

#### Testing Singleton Presentation Managers

When testing singleton Presentation Managers, you need to verify both their singleton behavior and their presentation logic. Here's a comprehensive test structure:

```typescript
import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  makeSingletonEntityExample,
  SingletonEntityExample
} from "../Entities/ExampleSingletonEntity";
import {
  ExampleSingletonPM,
  ExampleVM,
  makeExampleSingletonPM
} from "./ExampleSingletonPM";

describe("ExampleSingletonPM", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let entity: SingletonEntityExample;
  let pm: ExampleSingletonPM;
  let registerSingletonSpy: jest.SpyInstance;

  beforeEach(() => {
    // Set up the test environment
    appObjects = makeAppObjectRepo();
    registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

    appObject = appObjects.getOrCreate("test-id");

    // Create the singleton entity
    entity = makeSingletonEntityExample(appObject);

    // Create the singleton PM
    pm = makeExampleSingletonPM(appObject);
  });

  it("should initialize with a view model", () => {
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("should be retrievable as a singleton", () => {
    // Test the singleton getter
    const retrievedPM = ExampleSingletonPM.get(appObjects);
    expect(retrievedPM).toBe(pm);
  });

  it("should update view when entity changes", () => {
    const spy = jest.spyOn(pm, "doUpdateView");

    // Trigger a change in the entity
    entity.notifyOnChange();

    expect(spy).toHaveBeenCalled();
  });

  it("should reflect entity's boolean property in view model", () => {
    // Set the entity's property
    entity.aBoolProperty = false;

    // Check that the VM reflects this change
    expect(pm.lastVM?.aBoolProperty).toBe(false);

    // Change the entity's property
    entity.aBoolProperty = true;

    // Check that the VM reflects this change
    expect(pm.lastVM?.aBoolProperty).toBe(true);
  });

  it("should return true when comparing identical view models in vmsAreEqual", () => {
    const vm1: ExampleVM = { aBoolProperty: true };
    const vm2: ExampleVM = { aBoolProperty: true };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(true);
  });

  it("should return false when comparing different view models in vmsAreEqual", () => {
    const vm1: ExampleVM = { aBoolProperty: true };
    const vm2: ExampleVM = { aBoolProperty: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should register itself as a singleton", () => {
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });
});
```

Key testing considerations for singleton Presentation Managers:

1. **View Model Initialization**: Verify that the PM initializes with a view model (typically exposed via the `lastVM` property for testing)
2. **Singleton Behavior**: Test that the PM registers itself as a singleton and can be retrieved via its static getter
3. **Entity Observation**: Verify that the PM updates its view model when the entity changes
4. **View Model Transformation**: Test that entity state is correctly transformed into the view model format
5. **View Model Equality**: Test the `vmsAreEqual` method with both identical and different view models to ensure it works correctly
6. **Event Handling**: Use spies to verify that methods like `doUpdateView` are called when expected
7. **State Synchronization**: Test that changes to the entity are properly reflected in the view model

Testing singleton PMs involves verifying:

- Their singleton registration and accessibility
- Their entity observation setup
- Their view model transformation logic
- Their equality comparison implementation

These test patterns ensure singleton Presentation Managers work correctly both as PMs (with view models and views) and as singletons (with global registration and accessibility).

### Example: Non-Singleton Presentation Manager Implementation

Below is an example of a non-singleton Presentation Manager returning a primitive type (string) rather than a complex view model:

```typescript
import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { ExampleEntity } from "./ExampleEntity";

export abstract class ExamplePM extends AppObjectPM<string> {
  static readonly type = "ExamplePMUniqueType";

  // Non-singleton getter pattern that requires an ID
  static getById(id: string, appObjects: AppObjectRepo) {
    return appObjects.get(id)?.getComponent<ExamplePM>(ExamplePM.type);
  }
}

export function makeExamplePM(appObject: AppObject): ExamplePM {
  return new ExamplePMImp(appObject);
}

class ExamplePMImp extends ExamplePM {
  // Get component from the same AppObject this PM is attached to
  private get exampleEntity() {
    return this.getCachedLocalComponent<ExampleEntity>(ExampleEntity.type);
  }

  // Simple equality check for primitive string type
  vmsAreEqual(a: string, b: string): boolean {
    return a === b;
  }

  // Handler for entity changes
  onEntityChange = () => {
    if (!this.exampleEntity) return;

    // Simply pass the string property directly as the view model
    this.doUpdateView(this.exampleEntity.aStringProperty);
  };

  dispose = (): void => {
    super.dispose();
    this.exampleEntity?.removeChangeObserver(this.onEntityChange);
  };

  constructor(appObject: AppObject) {
    super(appObject, ExamplePM.type);

    // Subscribe to entity changes
    this.exampleEntity?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
```

This example demonstrates several key patterns different from the singleton PM example:

1. **Primitive View Model**:

   - The PM uses a string as its view model type instead of a complex object
   - No default view model is needed since undefined is an acceptable initial state
   - The `vmsAreEqual()` implementation is a simple string equality check

2. **Non-Singleton Access Pattern**:

   - Uses `getById(id, appObjects)` instead of a singleton getter
   - Consistent with the pattern used for non-singleton entities

3. **Local Component Access**:

   - Uses `getCachedLocalComponent<T>()` to find the entity on the same AppObject
   - This is different from `getCachedSingleton<T>()` which looks for components across the app object repo
   - The cached pattern improves performance by storing the reference after the first lookup

4. **Minimalist View Logic**:

   - Passes the entity's string property directly as the view model without transformation
   - While simple, this approach maintains the separation between entity and view

5. **Standard Lifecycle Management**:
   - Subscribes to entity changes in the constructor
   - Cleans up observers in the dispose method to prevent memory leaks

#### Testing Non-Singleton Presentation Managers

When testing non-singleton Presentation Managers, you need to verify both their component-specific behavior and their presentation logic. Here's a comprehensive test structure:

```typescript
import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { ExampleEntity, makeExampleEntity } from "../Entities/ExampleEntity";
import { ExamplePM, makeExamplePM } from "./ExamplePM";

describe("ExamplePM", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let entity: ExampleEntity;
  let pm: ExamplePM;

  beforeEach(() => {
    // Set up the test environment
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate("test-id");

    // Create and add the entity to the same AppObject
    entity = makeExampleEntity(appObject);

    // Create the PM on the same AppObject
    pm = makeExamplePM(appObject);
  });

  it("should initialize the vm", () => {
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("should update view when entity changes", () => {
    const spy = jest.spyOn(pm, "doUpdateView");

    entity.notifyOnChange();

    expect(spy).toHaveBeenCalled();
  });

  it("should set lastVM to entity string property value", () => {
    const testString = "test value";
    entity.aStringProperty = testString;

    expect(pm.lastVM).toBe(testString);
  });

  it("should return true when comparing same strings in vmsAreEqual", () => {
    expect(pm.vmsAreEqual("same", "same")).toBe(true);
  });

  it("should return false when comparing different strings in vmsAreEqual", () => {
    expect(pm.vmsAreEqual("different", "values")).toBe(false);
  });

  it("should be available via static getById", () => {
    const retrievedPM = ExamplePM.getById("test-id", appObjects);
    expect(retrievedPM).toBe(pm);
  });

  it("should clean up observers on dispose", () => {
    // Spy on removeChangeObserver
    const spy = jest.spyOn(entity, "removeChangeObserver");

    // Dispose the PM
    pm.dispose();

    // Should have called removeChangeObserver
    expect(spy).toHaveBeenCalledWith(expect.any(Function));

    // PM should no longer be attached to the AppObject
    expect(appObject.getComponent(ExamplePM.type)).toBeUndefined();
  });
});
```

Key testing considerations for non-singleton Presentation Managers:

1. **View Model Initialization**: Verify that the PM initializes with a view model (accessed via the `lastVM` property for testing)
2. **Entity Observation**: Test that the PM correctly observes and reacts to entity changes
3. **View Model Transformation**: Verify that entity state is correctly transformed into view model format (in this case, direct pass-through)
4. **Component Accessibility**: Test the static accessor method (`getById`) to ensure it retrieves the correct component
5. **Value Comparison Logic**: Test the `vmsAreEqual` method with both identical and different values
6. **Lifecycle Management**: Verify proper cleanup in the `dispose` method, including:
   - Removing change observers from entities
   - Removing the component from the AppObject
7. **Property Synchronization**: Test that the view model (lastVM) always reflects the entity's current state

Unlike singleton PMs, testing non-singleton PMs requires:

- Testing component retrieval by ID rather than global access
- Ensuring the PM works properly within the context of its specific AppObject
- Verifying that the PM accesses local components correctly
- Testing the primitive value equality logic rather than complex object comparisons

These test patterns ensure non-singleton Presentation Managers properly transform entity state into view models while maintaining appropriate component access patterns and proper lifecycle management.

### Example: Singleton Presentation Manager Adapters

Adapters provide a simplified interface for Framework-layer views to connect with Domain-layer Presentation Managers. Below is an example of an adapter for a singleton PM:

```typescript
import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  defaultSlideNavigationVM,
  ExampleSingletonPM,
  ExampleVM
} from "ExampleFeature/PMs/ExampleSingletonPM";

export const exampleSingletonPmAdapter: SingletonPmAdapter<ExampleVM> = {
  defaultVM: defaultSlideNavigationVM,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: ExampleVM) => void) => {
    const pm = ExampleSingletonPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "exampleSingletonPmAdapter",
        "Unable to find ExampleSingletonPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: ExampleVM) => void) => {
    ExampleSingletonPM.get(appObjects)?.removeView(setVM);
  }
};
```

This example demonstrates key patterns for PM adapters:

1. **Type Safety**:

   - The adapter is typed as `SingletonPmAdapter<ExampleVM>` to ensure it works with the correct view model type
   - This helps catch type mismatches at compile time rather than runtime

2. **Default View Model**:

   - Reuses the default view model from the PM (`defaultSlideNavigationVM`)
   - This ensures consistency between the PM and adapter implementations

3. **Subscription Pattern**:

   - The `subscribe` method handles finding the PM and registering the view function
   - Includes error handling for cases where the PM can't be found
   - The `unsubscribe` method safely removes the view function from the PM

4. **Error Handling**:

   - Uses `appObjects.submitError` to log issues when the PM can't be found
   - This helps with debugging while preventing runtime errors

5. **Simple Interface**:
   - Framework components only need to call `subscribe` with a setter function
   - All the complexity of finding and interacting with the PM is hidden

#### Testing Singleton PM Adapters

Like all Domain components, PM adapters should be thoroughly tested. Here's an example test structure for a singleton PM adapter:

```typescript
import { AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { makeMockExampleSingletonPM } from "../Mocks/MockExampleSingletonPM";
import {
  ExampleSingletonPM,
  defaultSlideNavigationVM
} from "../PMs/ExampleSingletonPM";
import { exampleSingletonPmAdapter } from "./exampleSingletonPmAdapter";

describe("Example Singleton PM Adapter", () => {
  let appObjects: AppObjectRepo;
  let mockPM: ExampleSingletonPM;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
  });

  it("Sets the Default VM", () => {
    mockPM = makeMockExampleSingletonPM(appObjects);
    expect(exampleSingletonPmAdapter.defaultVM).toEqual(
      defaultSlideNavigationVM
    );
  });

  it("Adds a view on subscribe", () => {
    mockPM = makeMockExampleSingletonPM(appObjects);
    const setVM = jest.fn();
    const subscribeSpy = jest.spyOn(mockPM, "addView");
    exampleSingletonPmAdapter.subscribe(appObjects, setVM);

    expect(subscribeSpy).toHaveBeenCalledWith(setVM);
  });

  it("Handles missing PM on subscribe", () => {
    const setVM = jest.fn();

    appObjects.submitError = jest.fn();
    appObjects.submitWarning = jest.fn(); //Suppresses a warning

    exampleSingletonPmAdapter.subscribe(appObjects, setVM);

    expect(appObjects.submitError).toHaveBeenCalledWith(
      "exampleSingletonPmAdapter",
      "Unable to find ExampleSingletonPM"
    );
  });

  it("Removes a view on unsubscribe", () => {
    mockPM = makeMockExampleSingletonPM(appObjects);
    const setVM = jest.fn();
    const unsubscribeSpy = jest.spyOn(mockPM, "removeView");
    exampleSingletonPmAdapter.unsubscribe(appObjects, setVM);

    expect(unsubscribeSpy).toHaveBeenCalledWith(setVM);
  });

  it("Handles missing PM on unsubscribe without error", () => {
    const setVM = jest.fn();

    appObjects.submitWarning = jest.fn(); //Suppresses a warning

    // This should not throw an error
    expect(() => {
      exampleSingletonPmAdapter.unsubscribe(appObjects, setVM);
    }).not.toThrow();
  });
});
```

Key testing considerations for PM adapters:

1. **Default View Model**: Verify the default view model matches the expected value
2. **View Subscription**: Test that the adapter properly registers the view function with the PM
3. **Error Handling**: Verify proper error messages are logged when the PM isn't found
4. **View Unsubscription**: Test that the adapter properly removes the view function from the PM
5. **Graceful Failure**: Ensure the adapter doesn't throw exceptions when components are missing
6. **Mock Usage**: Consider using mock PMs to isolate adapter tests from actual PM implementation

Adapters are particularly useful when:

- Framework components need a simpler interface to the domain
- You want to abstract away the details of PM lookup and error handling
- You need to provide default values for when the PM isn't available
- You want to create a boundary between Framework and Domain that's easy to maintain

In UI components, you would typically use these adapters like this:

```typescript
// React component example
import React, { useEffect, useState } from 'react';
import { useAppObjects } from '@vived/hooks';
import { exampleSingletonPmAdapter } from '../Adapters/exampleSingletonPmAdapter';
import { ExampleVM } from '../PMs/ExampleSingletonPM';

export const ExampleComponent: React.FC = () => {
  const appObjects = useAppObjects();
  const [viewModel, setViewModel] = useState<ExampleVM>(exampleSingletonPmAdapter.defaultVM);

  useEffect(() => {
    exampleSingletonPmAdapter.subscribe(appObjects, setViewModel);
    return () => {
      exampleSingletonPmAdapter.unsubscribe(appObjects, setViewModel);
    };
  }, [appObjects]);

  return (
    <div>
      <h2>{viewModel.displayText}</h2>
      <button disabled={!viewModel.isEnabled}>
        Example Button
      </button>
    </div>
  );
};
```

### Example: Non-Singleton Presentation Manager Adapters

While singleton PM adapters provide a simple way to connect views to global components, non-singleton adapters handle components that are specific to individual App Objects. Below is an example of an adapter for a non-singleton PM:

```typescript
import { AppObjectRepo, PmAdapter } from "@vived/core";
import { ExamplePM } from "ExampleFeature/PMs/ExamplePM";

export const examplePmAdapter: PmAdapter<string> = {
  defaultVM: "",
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: string) => void
  ) => {
    if (!id) return;

    const pm = ExamplePM.getById(id, appObjects);
    if (!pm) {
      appObjects.submitError("examplePmAdapter", "Unable to find ExamplePM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: string) => void
  ) => {
    ExamplePM.getById(id, appObjects)?.removeView(setVM);
  }
};
```

This example demonstrates key differences from singleton PM adapters:

1. **Type Differences**:

   - Typed as `PmAdapter<string>` instead of `SingletonPmAdapter<T>`
   - Works with a primitive view model type (string) rather than a complex object
   - The ID parameter allows it to target a specific instance of the component

2. **Default Value Definition**:

   - Since the PM doesn't provide a default value, it's defined directly in the adapter
   - For primitive types, simple values like empty strings or zeros are common defaults

3. **ID Parameter**:

   - The `subscribe` and `unsubscribe` methods require an ID parameter
   - This ID identifies which specific App Object contains the PM
   - The adapter returns early if no ID is provided

4. **Component Lookup**:

   - Uses the static `getById` method to find the specific PM instance
   - This is in contrast to singleton adapters that use the simpler `get` method

5. **Error Handling**:
   - Includes the same error handling pattern for missing components
   - The error message references the adapter name for clarity

### Testing Non-Singleton PM Adapters

Just like singleton adapters, non-singleton PM adapters should be thoroughly tested. Here's an example test structure that verifies all key behaviors:

```typescript
import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { MockExamplePM } from "../Mocks/MockExamplePM";
import { ExamplePM } from "../PMs/ExamplePM";
import { examplePmAdapter } from "./examplePmAdapter";

describe("Example PM Adapter", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let mockPM: ExamplePM;
  const testId = "test-appobject-id";
  const setVM = jest.fn();

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);
  });

  it("has an empty string as default VM", () => {
    expect(examplePmAdapter.defaultVM).toBe("");
  });

  it("adds a view on subscribe", () => {
    // Create the MockExamplePM instance
    mockPM = new MockExamplePM(appObject);

    const addViewSpy = jest.spyOn(mockPM, "addView");

    examplePmAdapter.subscribe(testId, appObjects, setVM);

    // Verify the view was added
    expect(addViewSpy).toHaveBeenCalledWith(setVM);
  });

  it("removes a view on unsubscribe", () => {
    // Create the MockExamplePM instance
    mockPM = new MockExamplePM(appObject);

    const removeViewSpy = jest.spyOn(mockPM, "removeView");

    examplePmAdapter.unsubscribe(testId, appObjects, setVM);

    // Verify the view was removed
    expect(removeViewSpy).toHaveBeenCalledWith(setVM);
  });

  it("handles missing id on subscribe by returning early", () => {
    const getByIdSpy = jest.spyOn(ExamplePM, "getById");
    appObjects.submitWarning = jest.fn(); //Suppresses a warning
    examplePmAdapter.subscribe("", appObjects, setVM);

    // Should return early without trying to get the PM
    expect(getByIdSpy).not.toHaveBeenCalled();
  });

  it("handles missing PM on subscribe", () => {
    // Setup the mock to return undefined (PM not found)
    jest.spyOn(ExamplePM, "getById").mockReturnValue(undefined);

    appObjects.submitError = jest.fn();
    appObjects.submitWarning = jest.fn(); //Suppresses a warning

    examplePmAdapter.subscribe(testId, appObjects, setVM);

    // Verify error was submitted
    expect(appObjects.submitError).toHaveBeenCalledWith(
      "examplePmAdapter",
      "Unable to find ExamplePM"
    );
  });

  it("handles missing PM on unsubscribe without error", () => {
    appObjects.submitWarning = jest.fn(); //Suppresses a warning

    // This should not throw an error
    expect(() => {
      examplePmAdapter.unsubscribe(testId, appObjects, setVM);
    }).not.toThrow();
  });
});
```

Key testing considerations specific to non-singleton PM adapters:

1. **ID Handling**: Test behavior when an empty or invalid ID is provided (`"handles missing id on subscribe by returning early"`)
2. **Component Test Setup**: Create and attach the mock PM to a specific test AppObject with a known ID
3. **GetById Mocking**: May need to mock the static `getById` method to test error handling scenarios
4. **Component Access Pattern**: Verify the adapter properly uses the component's `getById` method
5. **Early Return**: Test that the adapter returns early and doesn't attempt component lookup when ID is missing
6. **Targeted Mock Creation**: Create mocks that are attached to specific AppObjects with predictable IDs

Non-singleton adapters are particularly useful when:

- You need to work with multiple instances of the same component type
- Your views need to connect to components on specific App Objects
- You want to maintain the same clean interface despite the added complexity

In UI components, you would typically use these non-singleton adapters like this:

```typescript
// React component example with non-singleton adapter
import React, { useEffect, useState } from 'react';
import { useAppObjects } from '@vived/hooks';
import { examplePmAdapter } from '../Adapters/examplePmAdapter';

interface Props {
  objectId: string;  // ID of the AppObject containing the PM
}

export const ExampleComponent: React.FC<Props> = ({ objectId }) => {
  const appObjects = useAppObjects();
  const [text, setText] = useState<string>(examplePmAdapter.defaultVM);

  useEffect(() => {
    if (!objectId) return;

    examplePmAdapter.subscribe(objectId, appObjects, setText);
    return () => {
      examplePmAdapter.unsubscribe(objectId, appObjects, setText);
    };
  }, [appObjects, objectId]);

  return (
    <div>
      <p>{text || "No text available"}</p>
    </div>
  );
};
```

#### Example: Singleton Use Case Implementation

While many Use Cases operate on components attached to the same AppObject, some Use Cases need to be accessible globally and operate on singleton entities. Below is an example of a singleton Use Case implementation:

```typescript
import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { SingletonEntityExample } from "../Entities/ExampleSingletonEntity";

export abstract class ToggleExampleBooleanUC extends AppObjectUC {
  static readonly type = "ToggleExampleBooleanUCUniqueType";

  abstract toggleExampleBoolean(): void;

  static get = (
    appObjects: AppObjectRepo
  ): ToggleExampleBooleanUC | undefined =>
    getSingletonComponent(ToggleExampleBooleanUC.type, appObjects);
}

export function makeToggleExampleBooleanUC(
  appObject: AppObject
): ToggleExampleBooleanUC {
  return new ToggleExampleBooleanUCImp(appObject);
}

class ToggleExampleBooleanUCImp extends ToggleExampleBooleanUC {
  private get singletonEntityExample() {
    return this.getCachedSingleton<SingletonEntityExample>(
      SingletonEntityExample.type
    );
  }

  toggleExampleBoolean = () => {
    if (!this.singletonEntityExample) {
      this.warn("Unable to find SingletonEntityExample");
      return;
    }

    this.singletonEntityExample.aBoolProperty =
      !this.singletonEntityExample.aBoolProperty;
  };

  constructor(appObject: AppObject) {
    super(appObject, ToggleExampleBooleanUC.type);
    this.appObjects.registerSingleton(this);
  }
}
```

This example demonstrates key patterns for singleton Use Cases:

1. **Singleton Pattern**:

   - Uses `getSingletonComponent()` in the static getter
   - Calls `this.appObjects.registerSingleton(this)` in the constructor
   - Makes the Use Case globally accessible from anywhere in the app

2. **Singleton Component Access**:

   - Uses `getCachedSingleton<T>()` to access the singleton entity
   - This optimizes performance by caching the singleton reference

3. **Global Operation**:

   - Operates on a singleton entity rather than a local component
   - Provides functionality that can be invoked from multiple parts of the app
   - The operation is conceptually stateless (same behavior regardless of where it's called from)

4. **Simple Toggle Logic**:
   - Implements a straightforward toggling operation
   - Includes error handling for the case when the entity is not found
   - Follows the single responsibility principle

#### Testing Singleton Use Cases

A comprehensive test file for a singleton Use Case should verify both its core functionality and its singleton behavior. Here's an example test structure based on the `ToggleExampleBooleanUC` implementation:

```typescript
import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  makeSingletonEntityExample,
  SingletonEntityExample
} from "../Entities/ExampleSingletonEntity";
import {
  makeToggleExampleBooleanUC,
  ToggleExampleBooleanUC
} from "./ToggleExampleBooleanUC";

describe("ToggleExampleBooleanUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let entity: SingletonEntityExample;
  let uc: ToggleExampleBooleanUC;
  let registerSingletonSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a fresh repository for testing
    appObjects = makeAppObjectRepo();
    registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

    // Set up the singleton entity
    appObject = appObjects.getOrCreate("test-id");
    entity = makeSingletonEntityExample(appObject);

    // Create the use case
    uc = makeToggleExampleBooleanUC(appObject);
  });

  it("should register itself as a singleton", () => {
    // Verify that the UC registered itself as a singleton
    expect(registerSingletonSpy).toHaveBeenCalledWith(uc);
  });

  it("should be accessible through the static getter", () => {
    // Create a new AppObject to verify singleton access from anywhere
    appObjects.getOrCreate("another-id");

    // The UC should be accessible from any AppObject through the singleton getter
    const retrievedUC = ToggleExampleBooleanUC.get(appObjects);

    // Verify we got the original UC
    expect(retrievedUC).toBe(uc);
  });

  it("should toggle entity's boolean property from false to true", () => {
    // Set initial state
    entity.aBoolProperty = false;

    // Execute the toggle use case
    uc.toggleExampleBoolean();

    // Verify the property was toggled
    expect(entity.aBoolProperty).toBe(true);
  });

  it("should toggle entity's boolean property from true to false", () => {
    // Set initial state
    entity.aBoolProperty = true;

    // Execute the toggle use case
    uc.toggleExampleBoolean();

    // Verify the property was toggled
    expect(entity.aBoolProperty).toBe(false);
  });

  it("should log a warning when entity is not found", () => {
    // Create a test scenario where the singleton entity isn't available
    const newAppObjects = makeAppObjectRepo();
    const newAppObject = newAppObjects.getOrCreate("isolated-test");
    const isolatedUC = makeToggleExampleBooleanUC(newAppObject);

    // Spy on the warn method
    const warnSpy = jest.spyOn(isolatedUC, "warn");

    // Execute the use case without the required entity
    isolatedUC.toggleExampleBoolean();

    // Verify warning was logged
    expect(warnSpy).toHaveBeenCalledWith(
      "Unable to find SingletonEntityExample"
    );
  });
});
```

Key testing considerations for singleton Use Cases:

1. **Singleton Registration**: Verify that the Use Case registers itself as a singleton by spying on `registerSingleton`
2. **Global Accessibility**: Test that the Use Case can be accessed from any AppObject through its static getter
3. **Core Functionality**: Test both state transitions (false→true and true→false) to ensure complete coverage
4. **Error Handling**: Verify proper warnings are logged when dependencies (like the entity) are missing
5. **Clean Test Environment**: Create a fresh AppObjectRepo for each test to ensure isolation
6. **Complete Setup**: Ensure all required components (like the singleton entity) are properly created before testing
7. **Isolated Testing**: For error cases, create a completely separate repository to avoid interference

When working with singleton Use Cases in controllers, the implementation typically follows this pattern:

```typescript
// Example controller method
handleToggleButtonClick = () => {
  const toggleUC = ToggleExampleBooleanUC.get(this.appObjects);
  if (!toggleUC) {
    console.warn("Toggle UC not found");
    return;
  }

  toggleUC.toggleExampleBoolean();
};
```

Singleton Use Cases are particularly useful when:

- The operation needs to be available throughout the application
- The behavior operates on global state (singleton entities)
- The same functionality needs to be triggered from different parts of the UI
- The operation is conceptually a global action rather than specific to a particular object

Unlike non-singleton Use Cases that operate on local components, singleton Use Cases:

- Must be registered with `appObjects.registerSingleton(this)` in their constructor
- Use the `getSingletonComponent()` pattern in their static getter
- Access other singleton components using `getCachedSingleton<T>()` rather than `getCachedLocalComponent<T>()`
- Are instantiated only once per application

### Example: Non-Singleton Use Case Implementation

Use Cases encapsulate business logic and manipulate entities in response to user actions. Below is an example of a non-singleton Use Case implementation:

```typescript
import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { ExampleEntity } from "../Entities/ExampleEntity";

export abstract class EditExampleStringUC extends AppObjectUC {
  static readonly type = "EditExampleStringUCUniqueType";

  abstract editExampleString(text: string): void;

  static get(appObj: AppObject): EditExampleStringUC | undefined {
    return appObj.getComponent<EditExampleStringUC>(this.type);
  }

  static getById(
    id: string,
    appObjects: AppObjectRepo
  ): EditExampleStringUC | undefined {
    return appObjects.get(id)?.getComponent<EditExampleStringUC>(this.type);
  }
}

export function makeEditExampleStringUC(
  appObject: AppObject
): EditExampleStringUC {
  return new EditExampleStringUCImp(appObject);
}

class EditExampleStringUCImp extends EditExampleStringUC {
  private get exampleEntity() {
    return this.getCachedLocalComponent<ExampleEntity>(ExampleEntity.type);
  }

  editExampleString = (text: string) => {
    if (!this.exampleEntity) {
      this.warn("Unable to find ExampleEntity");
      return;
    }

    this.exampleEntity.aStringProperty = text;
  };

  constructor(appObject: AppObject) {
    super(appObject, EditExampleStringUC.type);
  }
}
```

This example demonstrates key patterns for Use Cases:

1. **Abstract Class Pattern**:

   - `EditExampleStringUC` is defined as an abstract class with abstract methods
   - The implementation details are hidden in the private `EditExampleStringUCImp` class
   - This enables easy mocking during testing

2. **Non-Singleton Pattern**:

   - Uses standard getter methods `get(appObj)` and `getById(id, appObjects)`
   - Operates on components attached to the same AppObject

3. **Local Component Access**:

   - Uses `getCachedLocalComponent<T>()` to access the entity on the same AppObject
   - Follows the best practice of creating a private getter for the component
   - The cached approach ensures the reference is looked up only once

4. **Error Handling**:

   - Validates entity existence before operating on it
   - Uses `this.warn()` for logging errors (a built-in method from `AppObjectUC`)
   - Exits early if expected component isn't found

5. **Single Responsibility**:
   - Implements a single, focused operation (`editExampleString`)
   - Name clearly communicates what action it performs
   - Method signature exposes only what's needed by consumers

#### Testing Use Cases

A comprehensive test file for a Use Case should verify both its core functionality and component access patterns. Here's an example test structure based on the `EditExampleStringUC` implementation:

```typescript
import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { ExampleEntity, makeExampleEntity } from "../Entities/ExampleEntity";
import {
  EditExampleStringUC,
  makeEditExampleStringUC
} from "./EditExampleStringUC";

describe("EditExampleStringUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let uc: EditExampleStringUC;
  let mockEntity: ExampleEntity;

  beforeEach(() => {
    // Create a fresh repository and app object for each test
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate("test-id");

    // Create the entity on the same app object
    mockEntity = makeExampleEntity(appObject);

    // Create the use case
    uc = makeEditExampleStringUC(appObject);
  });

  it("should edit the string property in the entity", () => {
    // Test the main functionality
    const newValue = "updated text";
    uc.editExampleString(newValue);

    // Verify the entity was updated
    expect(mockEntity.aStringProperty).toBe(newValue);
  });

  it("should log a warning when entity is not found", () => {
    // Create a new app object without the required entity
    const newAppObject = appObjects.getOrCreate("another-id");

    // Spy on the warn method
    const warnSpy = jest.spyOn(appObjects, "submitWarning");

    // Create a use case without the dependency
    const uc = makeEditExampleStringUC(newAppObject);

    // Execute the use case
    const newValue = "updated text";
    uc.editExampleString(newValue);

    // Verify warning was logged
    expect(warnSpy).toHaveBeenCalled();
  });

  it("should be retrievable via static get method", () => {
    // Test the component access pattern
    const retrievedUC = EditExampleStringUC.get(appObject);
    expect(retrievedUC).toBe(uc);
  });

  it("should be retrievable via static getById method", () => {
    // Test ID-based retrieval
    const retrievedUC = EditExampleStringUC.getById("test-id", appObjects);
    expect(retrievedUC).toBe(uc);
  });

  it("should return undefined when getById is called with non-existent id", () => {
    // Test graceful handling of missing components
    const retrievedUC = EditExampleStringUC.getById(
      "non-existent-id",
      appObjects
    );
    expect(retrievedUC).toBeUndefined();
  });
});
```

Key testing considerations for Use Cases:

1. **Core Functionality**: Test that the Use Case correctly updates the entity when called
2. **Error Handling**: Verify proper warnings are logged when dependencies are missing
3. **Component Access**: Test both the direct `get()` and ID-based `getById()` accessor methods
4. **Edge Cases**: Test behavior with invalid inputs or missing dependencies
5. **Side Effects**: If the Use Case has side effects (like triggering other operations), test those as well

When using Use Cases in controllers, the implementation is typically straightforward:

```typescript
// Example controller method
handleStringChange = (text: string) => {
  const editUC = EditExampleStringUC.get(this.appObject);
  if (!editUC) {
    console.warn("Edit UC not found");
    return;
  }

  editUC.editExampleString(text);
};
```

Use Cases are particularly useful when:

- You need to encapsulate business logic separate from UI concerns
- The same operation might be triggered from multiple places
- The operation might have side effects that should be centralized
- You want to make your business logic easily testable

### Example: Singleton Controller Function

Singleton controllers interact with globally accessible (singleton) Use Cases. Below is an example of a singleton controller function implementation:

```typescript
import { AppObjectRepo } from "@vived/core";
import { ToggleExampleBooleanUC } from "../UCs/ToggleExampleBooleanUC";

export function toggleExampleBoolean(appObjects: AppObjectRepo) {
  const uc = ToggleExampleBooleanUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "toggleExampleBoolean",
      "Unable to find ToggleExampleBooleanUC"
    );
    return;
  }

  uc.toggleExampleBoolean();
}
```

This example demonstrates key patterns for singleton controller functions:

1. **Parameter Structure**:

   - Only requires the `appObjects` parameter
   - Unlike non-singleton controllers, no ID parameter is needed
   - Any data required by the Use Case would be included as additional parameters

2. **Component Lookup**:

   - Uses the singleton `get()` static method instead of `getById()`
   - Retrieves the Use Case from the global singleton registry
   - This lookup pattern is consistent with the singleton component access pattern

3. **Error Handling**:

   - Checks if the Use Case exists before attempting to call its methods
   - Reports a clear warning message if the component isn't found
   - Includes the controller function name in the warning message for context
   - Returns early to avoid runtime errors

4. **Single Responsibility**:

   - Contains no business logic itself
   - Simply locates the appropriate Use Case and delegates the work
   - Maintains a clean separation between UI interaction and domain logic

5. **Simple Interface**:
   - Provides a function that can be easily imported and called from UI components
   - Requires minimal parameters (just the AppObjects repository)
   - Creates a clear entry point for a global application action

#### Testing Singleton Controllers

When testing singleton controllers, the focus is on verifying delegation to the singleton Use Case and proper error handling. Here's an example test file:

```typescript
import { AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  makeMockToggleExampleBooleanUC,
  MockToggleExampleBooleanUC
} from "../Mocks/MockToggleExampleBooleanUC";
import { toggleExampleBoolean } from "./toggleExampleBoolean";

describe("toggleExampleBoolean", () => {
  let appObjects: AppObjectRepo;
  let mockUC: MockToggleExampleBooleanUC;
  let mockToggleFunction: jest.Mock;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();

    // Create the mock UC
    mockUC = makeMockToggleExampleBooleanUC(appObjects.getOrCreate("test-id"));

    // Override the toggleExampleBoolean method with a Jest mock function
    mockToggleFunction = jest.fn();
    mockUC.toggleExampleBoolean = mockToggleFunction;
  });

  it("should call toggleExampleBoolean on the UC", () => {
    // Call the controller function
    toggleExampleBoolean(appObjects);

    // Verify that the mock function was called
    expect(mockToggleFunction).toHaveBeenCalledTimes(1);
  });

  it("should submit a warning when UC is not found", () => {
    // Create a new AppObjectRepo without the UC
    const emptyAppObjects = makeAppObjectRepo();

    // Spy on the warning submission method
    const submitWarningSpy = jest.spyOn(emptyAppObjects, "submitWarning");

    // Call the controller function with the empty repo
    toggleExampleBoolean(emptyAppObjects);

    // Verify warning was submitted
    expect(submitWarningSpy).toHaveBeenCalledWith(
      "toggleExampleBoolean",
      "Unable to find ToggleExampleBooleanUC"
    );

    // Verify that the toggleExampleBoolean method was not called
    expect(mockToggleFunction).not.toHaveBeenCalled();
  });
});
```

Key testing considerations for singleton controllers:

1. **Use Case Delegation**: Verify the controller calls the correct singleton Use Case method
2. **Error Handling**: Test that appropriate warnings are logged when the Use Case isn't found
3. **Graceful Failure**: Ensure the controller doesn't throw exceptions when the Use Case is missing
4. **Mock Usage**: Use mock singleton Use Cases to isolate the controller from actual business logic
5. **Clear Test Setup**: Create a clean test environment with the mock Use Case properly registered as a singleton

#### Using Singleton Controllers in Views

Singleton controllers provide a simpler interface for UI components since they don't require an object ID:

```typescript
// React component example using a singleton controller
import React from 'react';
import { useAppObjects } from '@vived/hooks';
import { toggleExampleBoolean } from '../Controllers/toggleExampleBoolean';

export const ToggleButton: React.FC = () => {
  const appObjects = useAppObjects();

  const handleClick = () => {
    toggleExampleBoolean(appObjects);
  };

  return (
    <button onClick={handleClick}>
      Toggle Boolean
    </button>
  );
};
```

Singleton controllers are particularly useful when:

- The operation affects global application state
- The action should be accessible from anywhere in the application
- You want to provide a consistent way to trigger global behaviors
- The operation conceptually applies to the entire application rather than a specific object

#### Implementing New Singleton Controllers

When implementing a new singleton controller function, follow these steps:

1. **Define the Function Signature**:

   - Include the `appObjects` parameter for access to the global component registry
   - Add any data parameters needed by the Use Case

2. **Handle Component Lookup**:

   - Use the appropriate static `get()` method to find the singleton Use Case
   - Check if the component exists before proceeding

3. **Implement Error Handling**:

   - Use `appObjects.submitWarning()` to log issues
   - Include the controller function name and a descriptive message
   - Return early if the required singleton component isn't found

4. **Delegate to the Use Case**:

   - Call the appropriate Use Case method with any required parameters
   - Keep the controller function focused on delegation without business logic

5. **Create the Test File**:
   - Test successful delegation to the Use Case
   - Test behavior when the Use Case cannot be found
   - Test that appropriate warnings are logged

By following these patterns, you'll create singleton controllers that provide clean, consistent access to global application behaviors while maintaining proper separation of concerns.

### Example: Mocking Singleton Components for Testing

Mocks are essential for isolating tests and simulating behavior without external dependencies. Below is an example of a mock implementation for a singleton PM:

```typescript
import { AppObject, AppObjectRepo } from "@vived/core";
import { ExampleSingletonPM } from "ExampleFeature/PMs/ExampleSingletonPM";

export class MockExampleSingletonPM extends ExampleSingletonPM {
  vmsAreEqual = () => {
    return true;
  };

  constructor(appObject: AppObject) {
    super(appObject, ExampleSingletonPM.type);
  }
}

export function makeMockExampleSingletonPM(appObjects: AppObjectRepo) {
  return new MockExampleSingletonPM(
    appObjects.getOrCreate("MockExampleSingletonPM")
  );
}
```

This example demonstrates key patterns for mocking components:

1. **Naming Convention**:

   - Mock classes are named with "Mock" prefixed to the original component name
   - This clearly identifies the class as a test double

2. **Simplified Implementation**:

   - Overrides methods with simplified versions (e.g., `vmsAreEqual` always returns true)
   - Focuses only on the behavior needed for testing

3. **Factory Function**:

   - Includes a factory function (`makeMockExampleSingletonPM`) for easy creation
   - For singleton components, the factory creates the mock with a consistent ID

4. **Inheritance**:
   - Extends the original component to maintain the interface
   - Allows the mock to be used anywhere the original component would be used

Mocks are particularly useful for:

- Isolating the component under test
- Simplifying complex behavior
- Controlling component state during tests
- Testing error conditions
- Verifying component interactions

In test files, you would typically use these mocks like this:

```typescript
describe("SomeFeature", () => {
  let mockPM: MockExampleSingletonPM;

  beforeEach(() => {
    const appObjects = makeAppObjectRepo(); // Use the factory instead of constructor
    mockPM = makeMockExampleSingletonPM(appObjects);
  });

  it("should handle some condition", () => {
    // Test with mock component
  });
});
```

### Example: Non-Singleton Controller Function Implementation

Controllers serve as the entry point for UI interactions, connecting the Framework layer to the Domain. Below is an example of a non-singleton controller function implementation:

```typescript
import { AppObjectRepo } from "@vived/core";
import { EditExampleStringUC } from "../UCs/EditExampleStringUC";

export function setExampleText(
  text: string,
  id: string,
  appObjects: AppObjectRepo
) {
  const uc = EditExampleStringUC.getById(id, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "setExampleText",
      "Unable to find EditExampleStringUC"
    );
    return;
  }

  uc.editExampleString(text);
}
```

This example demonstrates key patterns for non-singleton controller functions:

1. **Parameter Structure**:

   - Takes three parameters:
     - `text`: The input data to pass to the Use Case
     - `id`: The ID of the specific AppObject containing the Use Case
     - `appObjects`: The repository to find domain components

2. **Component Lookup**:

   - Uses the `getById()` static method to find the specific Use Case instance
   - This lookup pattern is consistent with the non-singleton component access pattern
   - Handles the case where the component doesn't exist

3. **Error Handling**:

   - Checks if the Use Case exists before attempting to call its methods
   - Reports a clear warning message if the component isn't found
   - Uses the same component that called the controller in the warning message for context
   - Returns early to avoid runtime errors

4. **Single Responsibility**:

   - Contains no business logic itself
   - Simply locates the appropriate Use Case and delegates the work
   - Passes input data directly without transformation

5. **Clean Interface**:
   - Provides a simple function that can be imported and called from UI components
   - Encapsulates the complexity of component lookup and validation
   - Serves as a clear boundary between Framework and Domain

#### Testing Non-Singleton Controllers

When testing non-singleton controllers, it's important to verify their delegation behavior and error handling. Here's an example test file:

```typescript
import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { MockEditExampleStringUC } from "../Mocks/MockEditExampleStringUC";
import { setExampleText } from "./setExampleText";

describe("setExampleText", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let mockUC: MockEditExampleStringUC;
  let mockSetFunction: jest.Mock;
  const testId = "test-appobject-id";

  beforeEach(() => {
    // Create a fresh repository for each test
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);

    // Create and add the mock use case
    mockUC = new MockEditExampleStringUC(appObject);
    mockSetFunction = jest.fn();
    mockUC.editExampleString = mockSetFunction;
  });

  it("should call EditExampleStringUC with the provided text", () => {
    const testText = "Hello World";

    // Call the controller function
    setExampleText(testText, testId, appObjects);

    // Verify the use case was called with the correct text
    expect(mockSetFunction).toBeCalledWith(testText);
  });

  it("should do nothing when UC cannot be found", () => {
    // Call with an ID that doesn't have the UC
    const nonExistentId = "non-existent-id";

    // This should not throw an error
    expect(() => {
      setExampleText("test", nonExistentId, appObjects);
    }).not.toThrow();

    // Verify our original mock wasn't called
    expect(mockSetFunction).not.toBeCalled();
  });

  it("should submit a warning when UC is not found", () => {
    // Create a new AppObjectRepo without the UC
    const emptyAppObjects = makeAppObjectRepo();

    // Spy on the warning submission method
    const submitWarningSpy = jest.spyOn(emptyAppObjects, "submitWarning");

    // Call the controller function with the empty repo
    setExampleText("test", "non-existent-id", emptyAppObjects);

    // Verify warning was submitted
    expect(submitWarningSpy).toHaveBeenCalledWith(
      "setExampleText",
      "Unable to find EditExampleStringUC"
    );

    // Verify that the editExampleString method was not called
    expect(mockSetFunction).not.toHaveBeenCalled();
  });
});
```

Key testing considerations for non-singleton controllers:

1. **Use Case Delegation**: Verify the controller calls the correct Use Case method with the right parameters
2. **Error Handling**: Test that appropriate warnings are logged when components aren't found
3. **Graceful Failure**: Ensure the controller doesn't throw exceptions when dependencies are missing
4. **Mock Usage**: Use mock Use Cases to isolate the controller from actual business logic implementation
5. **Parameter Passing**: Verify that all parameters are correctly passed through to the Use Case
6. **Clear Test Setup**: Create a clean test environment with predictable component structure

#### Using Non-Singleton Controllers in Views

When using non-singleton controller functions in the UI layer, you need to provide the specific object ID:

```typescript
// React component example using a non-singleton controller
import React, { useState } from 'react';
import { useAppObjects } from '@vived/hooks';
import { setExampleText } from '../Controllers/setExampleText';

interface Props {
  objectId: string;  // ID of the specific AppObject
}

export const TextEditor: React.FC<Props> = ({ objectId }) => {
  const appObjects = useAppObjects();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    setExampleText(text, objectId, appObjects);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Update Text</button>
    </div>
  );
};
```

Non-singleton controllers are particularly useful when:

- The operation affects local state rather than global application state
- You need to work with components that exist on specific App Objects
- Different instances of the same component type need different handling
- You want to maintain a consistent controller API pattern across your application

#### Implementing New Non-Singleton Controllers

When implementing a new non-singleton controller function, follow these steps:

1. **Define the Function Signature**:

   - Include all data parameters needed by the Use Case
   - Add the `id` parameter to specify the target AppObject
   - Include the `appObjects` parameter to access the repository

2. **Handle Component Lookup**:

   - Use the appropriate static `getById()` method to find the Use Case
   - Check if the component exists before proceeding

3. **Implement Error Handling**:

   - Use `appObjects.submitWarning()` to log issues
   - Include the controller function name and a descriptive message
   - Return early if the required component isn't found

4. **Delegate to the Use Case**:

   - Call the appropriate Use Case method with the required parameters
   - Don't include any business logic in the controller itself

5. **Create the Test File**:
   - Test successful delegation to the Use Case
   - Test behavior when the Use Case cannot be found
   - Test that appropriate warnings are logged

By following these patterns, you'll create controllers that maintain a clean separation between the Framework and Domain layers while providing a clear, consistent API for UI components.

### Example: Mocking Non-Singleton Components

Unlike singleton components that often include a factory function for their mocks, non-singleton components typically use a simpler approach. Below is an example of a mock implementation for a non-singleton PM:

```typescript
import { AppObject } from "@vived/core";
import { ExamplePM } from "../PMs/ExamplePM";

export class MockExamplePM extends ExamplePM {
  // Override the equality method with a simplified version
  vmsAreEqual = (a: string, b: string) => true;

  constructor(appObject: AppObject) {
    super(appObject, ExamplePM.type);
  }
```

This example demonstrates key differences from singleton mocks:

1. **No Factory Function**:

   - Unlike singleton mocks, non-singleton mocks typically don't need a dedicated factory function
   - They're created directly in the test as needed with the specific AppObject

2. **Test-Specific Properties**:

   - Adds tracking flags like `onEntityChangeCalled` to verify method invocation
   - These helper properties make test assertions easier

3. **Simplified Behavior**:

   - Overrides methods with test-friendly implementations
   - The `vmsAreEqual` method always returns true to simplify testing

4. **Usage Pattern**:
   - Created on a per-test basis rather than globally
   - Typically attached to the same test AppObject as the component being tested

In test files, you would typically use these non-singleton mocks like this:

```typescript
describe("SomeFeature", () => {
  let mockPM: MockExamplePM;

  beforeEach(() => {
    const appObjects = makeAppObjectRepo(); // Use the factory instead of constructor
    const appObject = appObjects.getOrCreate("test-id");
    mockPM = new MockExamplePM(appObject);
  });

  it("should handle some condition", () => {
    // Test with mock component
  });
});
```

### Component Access Patterns

Components often need to access other components in the system. There are two primary access patterns depending on the type of component being accessed:

#### Accessing Singleton Components

When a component needs to access a singleton component, it should use the `getCachedSingleton<T>` method, which will look up the component across the entire App Object repository, then cache the reference for future use:

```typescript
// Example from ExampleSingletonPM
private get exampleEntity() {
  return this.getCachedSingleton<SingletonEntityExample>(
    SingletonEntityExample.type
  );
}
```

#### Accessing Local Components

When a component needs to access another component that is attached to the same App Object, it should use the `getCachedLocalComponent<T>` method:

```typescript
// Example from ExamplePM
private get exampleEntity() {
  return this.getCachedLocalComponent<ExampleEntity>(ExampleEntity.type);
}
```

Using these cached getter patterns provides several benefits:

1. **Performance Optimization**: The component is only looked up once and then cached for subsequent access
2. **Clean Code**: The getter encapsulates the lookup logic in one place
3. **Dependency Direction**: Makes the dependency on other components explicit and easier to trace
4. **Type Safety**: The generic type parameter ensures type-safe access to the component

When deciding which pattern to use, consider:

- Use `getCachedSingleton<T>` for components that are guaranteed to be singletons in the system
- Use `getCachedLocalComponent<T>` for components that should exist on the same App Object
- Both methods handle the case where the component doesn't exist by returning undefined

## Testing Best Practices

When creating new files in the src folder, a test file must always be created simultaneously unless the file is a Mock. This is a strict requirement to maintain code quality and ensure all functionality is properly tested.

### Test File Naming and Location

- Test files must be named exactly like the source file with `.test.ts` appended
- For example:
  - Source file: `MyEntity.ts` → Test file: `MyEntity.test.ts`
  - Source file: `myController.ts` → Test file: `myController.test.ts`
- Test files should be located in the same directory as the source file

### Test File Content Requirements

Every test file should contain:

- Tests for each public method or property
- Tests for edge cases and error conditions
- Tests for normal/happy path behavior

### Testing Best Practices

1. **Don't Nest Describe Blocks:**
   - Keep test organization flat with a single level of `describe` blocks.
   - Each `describe` block should focus on a specific component or function.
   - Use clear test names instead of nesting to indicate relationships between tests.
   - This improves readability and makes test failures easier to locate.
2. **Test Only Implementation-Specific Functionality:**
   - Limit tests to what is actually implemented in the specific class or function.
   - Avoid testing functionality that is defined in super classes or inherited.
   - Focus on the unique behavior and logic added by the current implementation.
   - This prevents duplicate tests and reduces maintenance overhead when base classes change.
3. **Follow AAA Pattern (Arrange-Act-Assert):**
   - Clearly separate test setup, action execution, and verification.
   - This improves readability and makes the test's intent clear.
   - Use comments or blank lines to separate these sections if necessary.
4. **Use Meaningful Test Names:**
   - Name tests to describe the expected behavior, not the implementation.
   - Good: `it("should update counter when button is clicked")`
   - Avoid: `it("calls incrementCounter function")`

### Basic Test Structure

```typescript
import { makeAppObjectRepo } from "@vived/core";
import { MyComponent, makeMyComponent } from "./MyComponent";

describe("MyComponent", () => {
  let appObjects;
  let appObject;
  let component;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate("test-id");
    component = makeMyComponent(appObject);
  });

  it("should initialize with default values", () => {
    // Test initial state
    expect(component.someProperty).toBe(expectedValue);
  });

  it("should update property and notify observers", () => {
    // Setup observer
    const mockObserver = jest.fn();
    component.addChangeObserver(mockObserver);

    // Act
    component.someProperty = newValue;

    // Assert
    expect(component.someProperty).toBe(newValue);
    expect(mockObserver).toHaveBeenCalled();
  });

  // Additional tests for other methods and behaviors
});
```

### Testing Different Component Types

1. **Entities:**

   - Test property getters/setters
   - Test observer notification
   - Test any business logic methods

2. **Use Cases:**

   - Test the main business logic function
   - Test handling of invalid inputs
   - Test behavior when dependencies are missing

3. **Presentation Managers:**

   - Test view model generation from entity state
   - Test view model equality checks
   - Test entity observation setup/teardown

4. **Controllers:**

   - Test delegation to use cases
   - Test error handling
   - Test parameter passing
   - Use Mocks for Use Cases

5. **Adapters:**
   - Test subscription/unsubscription logic
   - Test error handling
   - Test default view model
   - Use Mocks for the Presentation Manager

Remember: No code should be written without corresponding tests!

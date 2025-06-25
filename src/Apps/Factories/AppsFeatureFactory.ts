import { AppObject, DomainFactory } from "@vived/core";
import { makeAppEntity, makeAppRepo } from "../Entities";
import { makeAppPM, makeAppsListPM } from "../PMs";

/**
 * Factory responsible for setting up the Apps domain components.
 * This factory initializes all entities, use cases, and presentation models
 * required for the Apps functionality.
 */
export class AppsFeatureFactory extends DomainFactory {
  // Unique name for this factory
  readonly factoryName = "AppsFeatureFactory";

  constructor(appObject: AppObject) {
    super(appObject);
  }

  /**
   * Sets up all entities required for the Apps system
   */
  setupEntities(): void {
    // Initialize entities
    makeAppRepo(this.appObject);
  }

  /**
   * Sets up all use cases for the Apps system
   */
  setupUCs(): void {
    // Note: App UCs have complex dependencies and should be set up
    // separately to avoid circular dependencies during factory initialization
  }

  /**
   * Sets up all presentation managers for the Apps system
   */
  setupPMs(): void {
    // App Repository PMs
    makeAppsListPM(this.appObject);
  }

  /**
   * Performs any final setup operations after all components are initialized
   */
  finalSetup(): void {
    // No additional setup required for apps
  }
}

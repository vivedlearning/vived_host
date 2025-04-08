import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { ZSpaceHostEntity } from "../Entities";

/**
 * EmulateZSpacePM is a singleton Presentation Manager that provides a boolean view model
 * indicating whether zSpace emulation is currently enabled.
 *
 * This PM allows UI components to observe and (through controllers) control whether
 * zSpace features should be emulated when actual zSpace hardware is not available.
 *
 * Usage in UI components:
 * 1. Via direct PM access (not recommended for UI components):
 *    const pm = EmulateZSpacePM.get(appObjects);
 *    pm?.addView((isEmulating) => { updateUIBasedOn(isEmulating); });
 *
 * 2. Via adapter (recommended for React/UI components):
 *    import { emulateZSpacePMAdapter } from "../Adapters";
 *
 *    // In a React component:
 *    const [isEmulating, setIsEmulating] = useState(emulateZSpacePMAdapter.defaultVM);
 *
 *    useEffect(() => {
 *      emulateZSpacePMAdapter.subscribe(appObjects, setIsEmulating);
 *      return () => emulateZSpacePMAdapter.unsubscribe(appObjects, setIsEmulating);
 *    }, [appObjects]);
 *
 * 3. To toggle emulation state (in a controller or UI event handler):
 *    import { toggleEmulateZSpace } from "../Controllers";
 *
 *    // When handling a UI event:
 *    const handleToggleEmulation = () => {
 *      toggleEmulateZSpace(appObjects);
 *    };
 *
 * Emulation is useful during development or when testing on systems without zSpace hardware.
 * When emulation is enabled, many zSpace-specific UI features can still be tested.
 */
export abstract class EmulateZSpacePM extends AppObjectPM<boolean> {
  static type = "EmulateZSpacePM";

  /**
   * Get the singleton instance of EmulateZSpacePM
   * @param appObjects - The AppObjectRepo instance
   * @returns The EmulateZSpacePM instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<EmulateZSpacePM>(
      EmulateZSpacePM.type,
      appObjects
    );
  }
}

/**
 * Factory function to create the EmulateZSpacePM
 * For internal use only - external code should use EmulateZSpacePM.get()
 *
 * @param appObject - The AppObject to attach the PM to
 * @returns A new EmulateZSpacePM instance
 */
export function makeEmulateZSpacePM(appObject: AppObject): EmulateZSpacePM {
  return new EmulateZSpacePMImp(appObject);
}

class EmulateZSpacePMImp extends EmulateZSpacePM {
  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private get zSpace() {
    return this.getCachedSingleton<ZSpaceHostEntity>(ZSpaceHostEntity.type);
  }

  private onEntityChange = () => {
    if (!this.zSpace) return;

    this.doUpdateView(this.zSpace.emulate);
  };

  constructor(appObject: AppObject) {
    super(appObject, EmulateZSpacePM.type);

    const zSpace = this.zSpace;
    if (!zSpace) {
      this.error(
        "PM Has been added to an app object that does not have a ZSpaceHostEntity"
      );
      return;
    }
    zSpace.addChangeObserver(this.onEntityChange);
    this.onEntityChange();

    this.appObjects.registerSingleton(this);
  }
}

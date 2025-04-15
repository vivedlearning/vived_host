import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { ZSpaceHostEntity } from "../Entities/ZSpaceHost";

/**
 * ZSpaceIsActivePM is a singleton Presentation Manager that provides a boolean view model
 * indicating whether zSpace is currently active.
 *
 * This PM observes ZSpaceHostEntity and updates its view model when the isActive property changes.
 *
 * Usage in UI components:
 * 1. Via direct PM access (not recommended for UI components):
 *    const pm = ZSpaceIsActivePM.get(appObjects);
 *    pm?.addView((isActive) => { updateUIBasedOn(isActive); });
 *
 * 2. Via adapter (recommended for React/UI components):
 *    import { zSpaceIsActivePMAdapter } from "../Adapters";
 *
 *    // In a React component:
 *    const [isZSpaceActive, setIsZSpaceActive] = useState(zSpaceIsActivePMAdapter.defaultVM);
 *
 *    useEffect(() => {
 *      zSpaceIsActivePMAdapter.subscribe(appObjects, setIsZSpaceActive);
 *      return () => zSpaceIsActivePMAdapter.unsubscribe(appObjects, setIsZSpaceActive);
 *    }, [appObjects]);
 *
 * When zSpace is active, UI components may want to:
 * - Display 3D content differently
 * - Show zSpace-specific controls
 * - Adjust UI layouts for stereoscopic viewing
 */
export abstract class ZSpaceIsActivePM extends AppObjectPM<boolean> {
  static type = "ZSpaceIsActivePM";

  /**
   * Get the singleton instance of ZSpaceIsActivePM
   * @param appObjects - The AppObjectRepo instance
   * @returns The ZSpaceIsActivePM instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ZSpaceIsActivePM>(
      ZSpaceIsActivePM.type,
      appObjects
    );
  }
}

/**
 * Factory function to create the ZSpaceIsActivePM
 * For internal use only - external code should use ZSpaceIsActivePM.get()
 *
 * @param appObject - The AppObject to attach the PM to
 * @returns A new ZSpaceIsActivePM instance
 */
export function makeZSpaceIsActivePM(appObject: AppObject): ZSpaceIsActivePM {
  return new ZSpaceIsActivePMImp(appObject);
}

class ZSpaceIsActivePMImp extends ZSpaceIsActivePM {
  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private get zSpace() {
    return this.getCachedSingleton<ZSpaceHostEntity>(ZSpaceHostEntity.type);
  }

  private onEntityChange = () => {
    if (!this.zSpace) return;

    this.doUpdateView(this.zSpace.isActive);
  };

  constructor(appObject: AppObject) {
    super(appObject, ZSpaceIsActivePM.type);

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

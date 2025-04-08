/**
 * ZSpaceHost Module
 * -----------------
 *
 * This module provides integration with zSpace stereoscopic 3D hardware through WebXR.
 * It allows applications to detect, start, stop, and monitor zSpace sessions,
 * as well as provide emulation when real hardware isn't available.
 *
 * Typical usage flow:
 *
 * 1. Initialization:
 *    ```typescript
 *    import { checkForWebXRSupport } from "@vived/host/ZSpaceHost/UCs";
 *
 *    // During app initialization
 *    await checkForWebXRSupport(appObjects);
 *    ```
 *
 * 2. Starting/Stopping zSpace:
 *    ```typescript
 *    import { StartZSpaceUC, StopZSpaceUC } from "@vived/host/ZSpaceHost/UCs";
 *
 *    // Start zSpace
 *    const startUC = StartZSpaceUC.get(appObjects);
 *    await startUC?.startZSpace();
 *
 *    // Stop zSpace
 *    const stopUC = StopZSpaceUC.get(appObjects);
 *    stopUC?.stopZSpace();
 *    ```
 *
 * 3. Checking Status:
 *    ```typescript
 *    import { ZSpaceHostEntity } from "@vived/host/ZSpaceHost/Entities";
 *
 *    const zSpace = ZSpaceHostEntity.get(appObjects);
 *    if (zSpace?.isSupported) {
 *      console.log("zSpace hardware is supported");
 *    }
 *    if (zSpace?.isActive) {
 *      console.log("zSpace is currently active");
 *    }
 *    ```
 *
 * 4. UI Integration (React example):
 *    ```typescript
 *    import { zSpaceIsActivePMAdapter } from "@vived/host/ZSpaceHost/Adapters";
 *
 *    function ZSpaceStatusIndicator() {
 *      const appObjects = useAppObjects();
 *      const [isActive, setIsActive] = useState(false);
 *
 *      useEffect(() => {
 *        zSpaceIsActivePMAdapter.subscribe(appObjects, setIsActive);
 *        return () => zSpaceIsActivePMAdapter.unsubscribe(appObjects, setIsActive);
 *      }, [appObjects]);
 *
 *      return <div>zSpace is {isActive ? "active" : "inactive"}</div>;
 *    }
 *    ```
 *
 * Key components:
 * - Entities/ZSpaceHost: Core entity storing zSpace state
 * - UCs/StartZSpace: Use case to initialize and start zSpace
 * - UCs/StopZSpace: Use case to stop active zSpace session
 * - PMs/ZSpaceIsActivePM: Presentation manager for active state
 * - PMs/EmulateZSpacePM: Presentation manager for emulation control
 */

export * from "./Adapters";
export * from "./Controllers";
export * from "./Entities";
export * from "./Factories";
export * from "./Mocks";
export * from "./PMs";
export * from "./UCs";

import { HostAppObjectRepo } from "../../../HostAppObject";
import { ZSpaceHostEntity } from "../Entities";

export function toggleEmulateZSpace(appObjects: HostAppObjectRepo) {
	const zSpace = ZSpaceHostEntity.get(appObjects);
	if(!zSpace) {
		appObjects.submitError("toggleEmulateZSpace", "Unable to find ZSpaceHostEntity");
		return;
	}

	zSpace.emulate = !zSpace.emulate;
}
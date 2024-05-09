import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { PatchAssetFileUC } from '../UCs/PatchAssetFileUC';

export class MockPatchAssetFileUC extends PatchAssetFileUC {
  doPatch = jest.fn().mockResolvedValue('new.filename');

  constructor(appObject: HostAppObject) {
    super(appObject, PatchAssetFileUC.type);
  }
}

export function mockMockPatchAssetFileUC(appObjects: HostAppObjectRepo) {
  return new MockPatchAssetFileUC(appObjects.getOrCreate('MockPatchAssetFileUC'));
}

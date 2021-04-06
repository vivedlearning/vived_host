import { DevicePreviewUC, DevicePreviewUCImp } from "../Core/DevicePreview";
import {
  clearSelectedDevicePreview,
  selectDevicePreviewByID,
} from "./DevicePreview";

function makeUseCase() {
  const useCase: DevicePreviewUC = new DevicePreviewUCImp();

  useCase.setDeviceList([
    {
      id: "device1",
      name: "device1",
      x: 10,
      y: 20,
    },
    {
      id: "device2",
      name: "device2",
      x: 20,
      y: 30,
    },
    {
      id: "device3",
      name: "device3",
      x: 30,
      y: 40,
    },
  ]);

  return useCase;
}

test("Selecting by index", () => {
  const uc = makeUseCase();

  selectDevicePreviewByID("device2", uc);
  expect(uc.getSelectedDevice()?.id).toEqual("device2");
});

test("Clearing the selection", () => {
  const uc = makeUseCase();
  uc.setSelectedDevice("device2");

  clearSelectedDevicePreview(uc);
  expect(uc.getSelectedDevice()).toBeUndefined();
});

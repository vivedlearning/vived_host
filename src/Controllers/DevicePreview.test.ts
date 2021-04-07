import { DevicePreviewUC, DevicePreviewUCImp } from "../Core/DevicePreview";
import {
  clearSelectedDevicePreview,
  selectDevicePreviewByID,
  setDeviceListFromJSON,
  DeviceList
} from "./DevicePreview";

const mockDeviceList:DeviceList = {
  "devices": [
    { "id": "iPhone12ProMax", "name": "iPhone 12 Pro Max", "x": 428, "y": 926, "pixelDensity": 3, "category": "Mobile" },
    { "id": "iPhone12Pro", "name": "iPhone 12 Pro", "x": 390, "y": 844, "pixelDensity": 3, "category": "Mobile" },
    { "id": "iPhone12", "name": "iPhone 12", "x": 390, "y": 844, "pixelDensity": 3, "category": "Mobile" },
    { "id": "iPhone12Mini", "name": "iPhone 12 Mini", "x": 360, "y": 780, "pixelDensity": 3, "category": "Mobile" },
    { "id": "DesktopSmall", "name": "Desktop: Small", "x": 1024, "y": 768, "pixelDensity": 1,"category": "Responsive Web" },
    { "id": "DesktopMedium", "name": "Desktop: Medium", "x": 1200, "y": 800, "pixelDensity": 1,"category": "Responsive Web" },
    { "id": "DesktopLarge", "name": "Desktop: Large", "x": 1920, "y": 1080, "pixelDensity": 1,"category": "Responsive Web" },
    { "id": "Tablet", "name": "Tablet", "x": 768, "y": 1024, "pixelDensity": 1,"category": "Responsive Web" },
    { "id": "400x400", "name": "400 x 400", "x": 400, "y": 400, "pixelDensity": 1,"category": "Custom" },
    { "id": "400x500", "name": "400 x 500", "x": 400, "y": 500, "pixelDensity": 1,"category": "Custom" },
    { "id": "500x500", "name": "500 x 500", "x": 500, "y": 500, "pixelDensity": 1,"category": "Custom" },
  ]
}

function makeUseCase() {
  const useCase: DevicePreviewUC = new DevicePreviewUCImp();

  useCase.setDeviceList([
    {
      id: 'device1',
      name: 'device1',
      x: 10,
      y: 20,
      pixelDensity: 2,
      category: `Category A`
    },
    {
      id: 'device2',
      name: 'device2',
      x: 20,
      y: 30,
      pixelDensity: 2,
      category: `Category B`
    },
    {
      id: 'device3',
      name: 'device3',
      x: 30,
      y: 40,
      pixelDensity: 2,
      category: `Category B`
    },
  ]);

  return useCase;
}

test("Loading JSON", ()=> {
  const useCase: DevicePreviewUC = new DevicePreviewUCImp();
  setDeviceListFromJSON(mockDeviceList, useCase);
  expect(useCase.getDeviceList()).toHaveLength(11)
})

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

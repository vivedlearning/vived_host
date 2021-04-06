import { DevicePreviewUC, DevicePreviewUCImp } from "../Core/DevicePreview";
import { DevicePreviewPM } from "./DevicePreviewPM";

class MockView {
  callbackCount = 0;
  updateView = () =>  {
    this.callbackCount++;
  }
}

function makeTestRig() {
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

  const view = new MockView();
  const pm = new DevicePreviewPM(useCase, view.updateView);

  return { useCase, pm, view };
}

test("PM Intializes correctly", () => {
  const { useCase } = makeTestRig();
  useCase.setSelectedDevice("device2");

  const pm = new DevicePreviewPM(useCase, ()=>{return;});

  expect(pm.selectedDeviceName).toEqual("device2");
  expect(pm.selectedDeviceX).toEqual(20);
  expect(pm.selectedDeviceY).toEqual(30);
  expect(pm.useDevicePreview).toEqual(true);
  expect(pm.selectedID).toEqual("device2");
  expect(pm.devices).toHaveLength(3);
  expect(pm.devices[0].name).toEqual("device1");
  expect(pm.devices[1].name).toEqual("device2");
  expect(pm.devices[2].name).toEqual("device3");
});

test("View and PM Update when the use case changes", ()=>{
  const { useCase, pm, view } = makeTestRig();
  useCase.setSelectedDevice("device2");

  expect(pm.selectedDeviceName).toEqual("device2");
  expect(pm.selectedDeviceX).toEqual(20);
  expect(pm.selectedDeviceY).toEqual(30);
  expect(pm.useDevicePreview).toEqual(true);
  expect(view.callbackCount).toEqual(1);
  expect(pm.selectedID).toEqual("device2");

  useCase.clearSelectedDevice();

  expect(pm.selectedDeviceName).toEqual("");
  expect(pm.selectedDeviceX).toEqual(0);
  expect(pm.selectedDeviceY).toEqual(0);
  expect(pm.useDevicePreview).toEqual(false);
  expect(view.callbackCount).toEqual(2);
  expect(pm.selectedID).toEqual("");
})

test("PM can be disposed", ()=>{
  const { useCase, pm, view } = makeTestRig();

  pm.dispose();

  useCase.setSelectedDevice("device2");
  expect(pm.useDevicePreview).toEqual(false);
  expect(view.callbackCount).toEqual(0);
})
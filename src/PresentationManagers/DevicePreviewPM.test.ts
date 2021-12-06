
import { makeDevicePreview } from "..";
import { DevicePreviewListPM, DevicePreviewListVM } from "./DevicePreviewListPM";

function makeTestRig() {
  const devicePreview = makeDevicePreview();

  devicePreview.deviceList = [
    {
      id: "device1",
      name: "device1",
      x: 10,
      y: 20,
      pixelDensity: 3,
      category: "A"
    },
    {
      id: "device2",
      name: "device2",
      x: 20,
      y: 30,
      pixelDensity: 3,
      category: "A"
    },
    {
      id: "device3",
      name: "device3",
      x: 30,
      y: 40,
      pixelDensity: 3,
      category: "B"
    },
  ];

  const viewCallback = jest.fn();
  const pm = new DevicePreviewListPM(devicePreview, viewCallback);

  return { devicePreview, pm, viewCallback };
}

function getViewCallbackCount(callback: jest.Mock<any, any>): number {
  return callback.mock.calls.length;
}

function getLastViewModel(callback: jest.Mock<any, any>): DevicePreviewListVM | undefined {
  const callbackCnt = getViewCallbackCount(callback);

  if(callbackCnt > 0)
  {
    return callback.mock.calls[callbackCnt - 1][0];
  } else
  {
    return undefined;
  }
}

test("PM Intializes correctly", () => {
  const { devicePreview } = makeTestRig();
  devicePreview.setSelectedDevice("device2");

  const callback = jest.fn();
  // tslint:disable-next-line: no-unused-expression
  new DevicePreviewListPM(devicePreview, callback);

  const vm = getLastViewModel(callback);

  expect(vm?.selectedDeviceName).toEqual("device2");
  expect(vm?.selectedDeviceX).toEqual(20);
  expect(vm?.selectedDeviceY).toEqual(30);
  expect(vm?.useDevicePreview).toEqual(true);
  expect(vm?.selectedDeviceID).toEqual("device2");

  expect(vm?.catagorizedDevices.has("A")).toEqual(true);
  expect(vm?.catagorizedDevices.get("A")).toHaveLength(2);

  expect(vm?.catagorizedDevices.has("B")).toEqual(true);
  expect(vm?.catagorizedDevices.get("B")).toHaveLength(1);
});

test("View and PM Update when the use case changes", ()=>{
  const { devicePreview, pm, viewCallback } = makeTestRig();
  devicePreview.setSelectedDevice("device2");
  
  const callbackCnt = getViewCallbackCount(viewCallback);
  expect(callbackCnt).toEqual(2);

  const vm = getLastViewModel(viewCallback);
  expect(vm?.selectedDeviceName).toEqual("device2");
  expect(vm?.selectedDeviceX).toEqual(20);
  expect(vm?.selectedDeviceY).toEqual(30);
  expect(vm?.useDevicePreview).toEqual(true);
  expect(vm?.selectedDeviceID).toEqual("device2");

  devicePreview.clearSelectedDevice();

  const callbackCnt2 = getViewCallbackCount(viewCallback);
  expect(callbackCnt2).toEqual(3);

  const vm2 = getLastViewModel(viewCallback);
  expect(vm2?.selectedDeviceName).toEqual("");
  expect(vm2?.selectedDeviceX).toEqual(0);
  expect(vm2?.selectedDeviceY).toEqual(0);
  expect(vm2?.useDevicePreview).toEqual(false);
  expect(vm2?.selectedDeviceID).toEqual("");
})

test("PM can be disposed", ()=>{
  const { devicePreview, pm, viewCallback } = makeTestRig();

  pm.dispose();

  devicePreview.setSelectedDevice("device2");

  const callbackCnt = getViewCallbackCount(viewCallback);
  expect(callbackCnt).toEqual(1);
})
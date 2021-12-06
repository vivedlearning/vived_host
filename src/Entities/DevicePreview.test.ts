import { DeviceInfo, makeDevicePreview } from './DevicePreview';

function makeTestRig() {
  const devicePreview = makeDevicePreview();
  const observer = jest.fn();
  devicePreview.addObserver(observer);

  return { devicePreview, observer };
}

test('Setting the device list', () => {
  const { devicePreview, observer } = makeTestRig();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat' }
  ];

  devicePreview.deviceList = devices;

  expect(devicePreview.deviceList).toHaveLength(2);
  expect(observer).toBeCalled();
});

test("Setting the selected device", ()=>{
  const { devicePreview, observer } = makeTestRig();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat' }
  ];
  devicePreview.deviceList = devices;
  observer.mockClear();

  devicePreview.setSelectedDevice("device2");
  
  expect(observer).toBeCalled();
  expect(devicePreview.selectedDevice?.id === "device2");
})

test("Setting the selected device only notifies if there is a change", ()=>{
  const { devicePreview, observer } = makeTestRig();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat' }
  ];
  devicePreview.deviceList = devices;
  devicePreview.setSelectedDevice("device2");
  observer.mockClear();
  
  devicePreview.setSelectedDevice("device2");
  devicePreview.setSelectedDevice("device2");
  devicePreview.setSelectedDevice("device2");

  expect(observer).not.toBeCalled();
})

test("Setting an unknown device should warn", ()=>{
  const { devicePreview } = makeTestRig();
  console.warn = jest.fn();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat' }
  ];
  devicePreview.deviceList = devices;
  devicePreview.setSelectedDevice("unknown");

  expect(console.warn).toBeCalled();
})

test("Clearing the selected device", ()=>{
  const { devicePreview, observer } = makeTestRig();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat' }
  ];
  devicePreview.deviceList = devices;
  devicePreview.setSelectedDevice("device2");
  observer.mockClear();
  
  devicePreview.clearSelectedDevice();

  expect(observer).toBeCalled();
  expect(devicePreview.selectedDevice).toBeUndefined();
})

test("Clearing the selected device only notifies if something changes", ()=>{
  const { devicePreview, observer } = makeTestRig();
  observer.mockClear();
  
  devicePreview.clearSelectedDevice();
  devicePreview.clearSelectedDevice();
  devicePreview.clearSelectedDevice();

  expect(observer).not.toBeCalled();
})

test("Getting the category list", ()=>{
  const { devicePreview } = makeTestRig();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat1' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat2' },
    { id: 'device3', name: 'device 3', x: 1, y: 2, pixelDensity: 3, category: 'cat1' }
  ];
  devicePreview.deviceList = devices;

  const categories = devicePreview.getCategoryList();

  expect(categories).toHaveLength(2);
  expect(categories.includes('cat1')).toEqual(true);
  expect(categories.includes('cat2')).toEqual(true);
})

test("Getting devices in a category", ()=>{
  const { devicePreview } = makeTestRig();

  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat1' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat2' },
    { id: 'device3', name: 'device 3', x: 1, y: 2, pixelDensity: 3, category: 'cat1' }
  ];
  devicePreview.deviceList = devices;

  const cat1 = devicePreview.getDevicesInCategory("cat1");
  const cat2 = devicePreview.getDevicesInCategory("cat2");
  const cat3 = devicePreview.getDevicesInCategory("unknown");

  expect(cat1).toHaveLength(2);
  expect(cat2).toHaveLength(1);
  expect(cat3).toHaveLength(0);
})

test("Remove observer", ()=>{
  const { devicePreview, observer } = makeTestRig();
  observer.mockClear();

  devicePreview.removeObserver(observer);
  const devices: DeviceInfo[] = [
    { id: 'device1', name: 'device 1', x: 1, y: 2, pixelDensity: 3, category: 'cat' },
    { id: 'device2', name: 'device 2', x: 4, y: 5, pixelDensity: 6, category: 'cat' }
  ];
  devicePreview.deviceList = devices;
  devicePreview.setSelectedDevice("device2");

  expect(observer).not.toBeCalled();
});
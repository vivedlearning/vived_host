import { DeviceInfo, DevicePreviewUC, OnSelectedDeviceChange } from './boundary';
import { DevicePreviewUCImp } from './DevicePreviewUCImp';
import { DuplicateDeviceIDError } from './DuplicateDeviceIDError';
import { InvalidDeviceIDError } from './InvalidDeviceIDError';

class MockObserver implements OnSelectedDeviceChange {
  callbackCount = 0;

  onSelectedDeviceChange = () => {
    this.callbackCount++;
  };
}

function makeTestRig(deviceCount: number) {
  const useCase: DevicePreviewUC = new DevicePreviewUCImp();
  const devices: DeviceInfo[] = [];

  for (let index = 0; index < deviceCount; index++) {
    devices.push({
      id: `device_${index + 1}`,
      name: `Device ${index + 1}`,
      x: (index + 1) * 10,
      y: (index + 1) * 10,
      pixelDensity: 2,
      category: `Category ${index + 1}`
    });
  }
  useCase.setDeviceList(devices);

  const observer = new MockObserver();
  useCase.addObserver(observer);

  return { useCase, observer };
}

test('Initialization', () => {
  const { useCase } = makeTestRig(0);

  expect(useCase.getSelectedDevice()).toBeUndefined();
  expect(useCase.getDeviceList()).toHaveLength(0);
});

test('Adding a list of devices', () => {
  const { useCase } = makeTestRig(0);

  const devices: DeviceInfo[] = [
    {
      id: 'device1',
      name: 'device1',
      x: 10,
      y: 20,
      pixelDensity: 2,
      category: `Category`
    },
    {
      id: 'device2',
      name: 'device2',
      x: 20,
      y: 30,
      pixelDensity: 2,
      category: `Category`
    },
    {
      id: 'device3',
      name: 'device3',
      x: 30,
      y: 40,
      pixelDensity: 2,
      category: `Category`
    },
  ];

  useCase.setDeviceList(devices);

  const deviceList = useCase.getDeviceList();

  expect(deviceList).toHaveLength(3);
  deviceList.forEach((device, i) => {
    expect(devices[i].name).toEqual(device.name);
    expect(devices[i].x).toEqual(device.x);
    expect(devices[i].y).toEqual(device.y);
  });
});

test('Selecting a device', () => {
  const { useCase } = makeTestRig(3);

  useCase.setSelectedDevice('device_2');

  const selected = useCase.getSelectedDevice();
  expect(selected?.name).toEqual('Device 2');
  expect(selected?.x).toEqual(20);
  expect(selected?.y).toEqual(20);
});

test('Selecting an invalid device id should throw an error', () => {
  const { useCase } = makeTestRig(3);

  expect(() => useCase.setSelectedDevice('unknwon')).toThrowError(InvalidDeviceIDError);
});

test('Observers are notified when the selected device changes', () => {
  const { useCase, observer } = makeTestRig(3);
  useCase.setSelectedDevice('device_2');

  expect(observer.callbackCount).toEqual(1);

  useCase.setSelectedDevice('device_2');
  expect(observer.callbackCount).toEqual(1); // no notification
});

test('Clearing the selection', () => {
  const { useCase, observer } = makeTestRig(3);
  useCase.setSelectedDevice('device_2');
  useCase.clearSelectedDevice();

  expect(useCase.getSelectedDevice()).toBeUndefined();
  expect(observer.callbackCount).toEqual(2);

  useCase.clearSelectedDevice();
  expect(observer.callbackCount).toEqual(2); // No change
});

test('Removing an Observer', () => {
  const { useCase, observer } = makeTestRig(3);
  useCase.removeObserver(observer);
  useCase.setSelectedDevice('device_2');

  expect(observer.callbackCount).toEqual(0);
});

test('Adding a duplicate device should throw an error', () => {
  const { useCase } = makeTestRig(0);

  const devices: DeviceInfo[] = [
    {
      id: 'device1',
      name: 'device1',
      x: 10,
      y: 20,
      pixelDensity: 2,
      category: `Category`
    },
    {
      id: 'device1',
      name: 'device2',
      x: 20,
      y: 30,
      pixelDensity: 2,
      category: `Category`
    },
  ];

  expect(() => useCase.setDeviceList(devices)).toThrowError(DuplicateDeviceIDError);
});

test("Get Category List", ()=>{
  const { useCase } = makeTestRig(3);
  expect(useCase.getCategoryList()).toHaveLength(3);
})

test("Get devices for a category", ()=>{
  const { useCase } = makeTestRig(0);

  const devices: DeviceInfo[] = [
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
  ];

  useCase.setDeviceList(devices);

  expect(useCase.getDevicesInCategory("Category A")).toHaveLength(1);
  expect(useCase.getDevicesInCategory("Category B")).toHaveLength(2);
})
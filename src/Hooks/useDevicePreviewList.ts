import { useEffect, useRef, useState } from 'react';
import { DevicePreviewListUC } from '../Core/DevicePreviewList';
import {
  DeviceInfo,
  DevicePreviewListPM,
  DevicePreviewListVM,
} from '../Interface/PresentationModels/DevicePreviewListPM';

export function useDevicePreviewList(devicePreviewUC: DevicePreviewListUC | undefined) {
  const pm = useRef<DevicePreviewListPM>();
  const [viewModel, setViewModel] = useState<DevicePreviewListVM>({
    useDevicePreview: false,
    selectedDeviceID: '',
    selectedDeviceName: '',
    selectedDeviceX: 0,
    selectedDeviceY: 0,
    devices: new Map<string, DeviceInfo[]>(),
  });

  useEffect(() => {
    if (devicePreviewUC && !pm.current) {
      pm.current = new DevicePreviewListPM(devicePreviewUC, (vm) => setViewModel(vm));
    }
    return () => {
      pm.current?.dispose();
    };
  }, [devicePreviewUC]);

  return viewModel;
}

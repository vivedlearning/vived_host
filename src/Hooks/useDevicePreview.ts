import { useEffect, useRef, useState } from 'react';
import { DevicePreviewUC } from '../Core/DevicePreview';
import { DeviceInfo, DevicePreviewPM } from '../PresentationModels/DevicePreviewPM';

export function useDevicePreview(devicePreviewUC: DevicePreviewUC) {
  const pm = useRef<DevicePreviewPM>();
  const [showPreview, setShowPreview] = useState(false);
  const [previewName, setPreviewName] = useState('');
  const [previewX, setPreviewX] = useState(0);
  const [previewY, setPreviewY] = useState(0);
  const [previewID, setSelectedPreviewID] = useState('');
  const [deviceCategoryList, setDeviceCategoryList] = useState(new Map<string, DeviceInfo[]>());

  function updateView() {
    if (pm.current) {
      setShowPreview(pm.current.useDevicePreview);
      setPreviewName(pm.current.selectedDeviceName);
      setPreviewX(pm.current.selectedDeviceX);
      setPreviewY(pm.current.selectedDeviceY);
      setDeviceCategoryList(pm.current.devices);
      setSelectedPreviewID(pm.current.selectedID);
    }
  }

  useEffect(() => {
    if (!pm.current) {
      pm.current = new DevicePreviewPM(devicePreviewUC, updateView);
      updateView();
    }
    return () => {
      pm.current?.dispose();
    };
  }, [devicePreviewUC]);

  return {
    showPreview,
    previewName,
    previewX,
    previewY,
    deviceCategoryList,
    previewID,
  };
}

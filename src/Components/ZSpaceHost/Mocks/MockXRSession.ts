export class MockXRSession implements XRSession {
  inputSources: XRInputSourceArray = [];
  renderState: XRRenderState = {
    depthFar: 0,
    depthNear: 0,
  };
  environmentBlendMode: XREnvironmentBlendMode = "additive";
  visibilityState: XRVisibilityState = "hidden";
  isSystemKeyboardSupported = true;
  cancelAnimationFrame(id: number): void {
    throw new Error("Method not implemented.");
  }
  end(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  requestAnimationFrame(callback: XRFrameRequestCallback): number {
    throw new Error("Method not implemented.");
  }
  requestReferenceSpace(
    type: XRReferenceSpaceType
  ): Promise<XRReferenceSpace | XRBoundedReferenceSpace> {
    throw new Error("Method not implemented.");
  }
  updateRenderState(renderStateInit?: XRRenderStateInit): Promise<void> {
    throw new Error("Method not implemented.");
  }
  updateTargetFrameRate(rate: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onend = jest.fn();
  oninputsourceschange = jest.fn();
  onselect = jest.fn();
  onselectstart = jest.fn();
  onselectend = jest.fn();
  onsqueeze = jest.fn();
  onsqueezestart = jest.fn();
  onsqueezeend = jest.fn();
  onvisibilitychange = jest.fn();
  onframeratechange = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }
}

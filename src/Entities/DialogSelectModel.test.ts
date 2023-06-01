import { DialogSelectModel } from './DialogSelectModel';

function makeTestRig() {
  const selectModelDialog = new DialogSelectModel();
  const mockObserver = jest.fn();
  selectModelDialog.addObserver(mockObserver);

  return {
    selectModelDialog,
    mockObserver,
  };
}

describe('DialogSelectModel Entity', () => {
  it('notify when isReady is updated', () => {
    const { selectModelDialog, mockObserver } = makeTestRig();
    selectModelDialog.isReady = true;
    expect(mockObserver).toBeCalled();
  });

  it('Does not notify when isReady is the same', () => {
    const { selectModelDialog, mockObserver } = makeTestRig();
    selectModelDialog.isReady = true;
    mockObserver.mockClear();
    selectModelDialog.isReady = true;
    expect(mockObserver).not.toBeCalled();
  });

  it('notify when container is set', () => {
    const { selectModelDialog, mockObserver } = makeTestRig();
    const mockElement = {} as HTMLElement;
    selectModelDialog.container = mockElement;
    mockObserver.mockClear();
    selectModelDialog.isReady = true;
    expect(mockObserver).toBeCalled();
  });
});

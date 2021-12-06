import { makeDialogRepo } from '../..';
import { DialogPM, DialogVM } from './DialogPM';

function makeTestRig() {
  const dialogRepo = makeDialogRepo();
  const view = jest.fn();
  const pm = new DialogPM(dialogRepo, view);
  return { dialogRepo, pm, view };
}

test('PM initializes', () => {
  const { view } = makeTestRig();
  expect(view).toBeCalledWith(expect.objectContaining({ showDialog: false }));
});

test('PM updates when use case changes', () => {
  const { dialogRepo, view } = makeTestRig();
  view.mockClear();
  dialogRepo.createDialog('test');

  expect(view).toBeCalledWith(expect.objectContaining({ message: 'test' }));
});

test('PM disposes', () => {
  const { dialogRepo, pm, view } = makeTestRig();
  view.mockClear();
  pm.dispose();
  dialogRepo.createDialog('test');

  expect(view).not.toBeCalled();
});

test('All possible values set correctly in the VM', () => {
  const { dialogRepo, view } = makeTestRig();
  view.mockClear();
  dialogRepo.createDialog('test message', 'test title', { text: 'primary text' }, { text: 'secondary text' });
  const lastVM = view.mock.calls[0][0] as DialogVM;

  expect(lastVM.showDialog).toEqual(true);
  expect(lastVM.message).toEqual('test message');
  expect(lastVM.title).toEqual('test title');
  expect(lastVM.primaryActionText).toEqual('primary text');
  expect(lastVM.secondaryActionText).toEqual('secondary text');
});

import { Dialog, makeDialogRepo } from './DialogRepo';

function makeTestRig() {
  const dialogRepo = makeDialogRepo();
  const observer = jest.fn();
  dialogRepo.addObserver(observer);
  return { dialogRepo, observer };
}

test('Initial state', () => {
  const { dialogRepo } = makeTestRig();
  expect(dialogRepo.getCurrentDialog()).toEqual(undefined);
});

test('Making a dialog triggers the observer', () => {
  const { dialogRepo, observer } = makeTestRig();
  dialogRepo.createDialog('testing');

  expect(observer).toBeCalled();
  const lastDialog = observer.mock.calls[0][0] as Dialog;

  expect(lastDialog.message).toEqual('testing');
  expect(dialogRepo.getCurrentDialog()?.message).toEqual('testing');
});

test('Observer can be removed', () => {
  const { dialogRepo, observer } = makeTestRig();
  dialogRepo.removeObserver(observer);

  dialogRepo.createDialog('testing');

  expect(observer).not.toBeCalled();
});

test('Making a dialog with a title sets the title', () => {
  const { dialogRepo } = makeTestRig();

  dialogRepo.createDialog('testing', 'TITLE');

  expect(dialogRepo.getCurrentDialog()?.title).toEqual('TITLE');
  expect(dialogRepo.getCurrentDialog()?.message).toEqual('testing');
});

test('Making a dialog without a primary action sets a default action button to OK', () => {
  const { dialogRepo } = makeTestRig();

  dialogRepo.createDialog('testing');
  expect(dialogRepo.getCurrentDialog()?.primaryAction.text).toEqual('OK');
});

test('Making a dialog with a primary action sets action text', () => {
  const { dialogRepo } = makeTestRig();

  dialogRepo.createDialog('testing', undefined, { text: 'PRIMARY' });
  expect(dialogRepo.getCurrentDialog()?.primaryAction.text).toEqual('PRIMARY');
});

test('Making a dialog with a secondary action sets secondary action text', () => {
  const { dialogRepo } = makeTestRig();

  dialogRepo.createDialog('testing', undefined, undefined, { text: 'SECONDARY' });
  expect(dialogRepo.getCurrentDialog()?.secondaryAction?.text).toEqual('SECONDARY');
});

test('Primary action can be called and dialog dismissed', () => {
  const { dialogRepo, observer } = makeTestRig();
  const actionFunction = jest.fn();
  dialogRepo.createDialog('testing', 'title', {
    action: actionFunction,
    text: 'action text',
  });

  observer.mockClear();
  dialogRepo.callPrimaryDialogAction();
  expect(actionFunction).toHaveBeenCalled();

  expect(observer).toBeCalledWith(undefined);
});

test('Secondary action can be called and dialog dismissed', () => {
  const { dialogRepo, observer } = makeTestRig();
  const actionFunction = jest.fn();
  dialogRepo.createDialog('testing', 'title', undefined, {
    action: actionFunction,
    text: 'action text',
  });

  observer.mockClear();
  dialogRepo.callSecondaryDialogAction();
  expect(actionFunction).toHaveBeenCalled();

  expect(observer).toBeCalledWith(undefined);
});

test('Primary and secondary actions without action functions can still be dismissed', () => {
  const { dialogRepo, observer } = makeTestRig();
  dialogRepo.createDialog('testing', 'title', {
    text: 'action text',
  });
  observer.mockClear();
  dialogRepo.callPrimaryDialogAction();
  expect(observer).toBeCalledWith(undefined);

  dialogRepo.createDialog('testing', 'title', undefined, {
    text: 'action text',
  });

  observer.mockClear();
  dialogRepo.callSecondaryDialogAction();
  expect(observer).toBeCalledWith(undefined);
});

test('Dialogs can be queded up and the queue empties as they are dismissed', () => {
  const { dialogRepo } = makeTestRig();
  dialogRepo.createDialog('test 1', 'title');
  dialogRepo.createDialog('test 2', 'title', undefined, {
    text: 'secondary text',
  });

  expect(dialogRepo.getCurrentDialog()?.message).toEqual('test 1');
  dialogRepo.callPrimaryDialogAction();
  expect(dialogRepo.getCurrentDialog()?.message).toEqual('test 2');
  dialogRepo.callSecondaryDialogAction();
  expect(dialogRepo.getCurrentDialog()).toBeUndefined();
});

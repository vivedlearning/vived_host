import { DialogBase, DialogMarkDownEditor, DialogMarkDownEditorDTO, makeDialogRepo } from '../../Entities';
import { MarkDownEditorDialogPM, MarkDownEditorDialogVM } from './MarkDownEditorDialogPM';

function makeTestRig() {
  const repo = makeDialogRepo();
  const view = jest.fn();
  const pm = new MarkDownEditorDialogPM(repo, view);

  return { pm, view, repo };
}

function makeMockDialog(type: string): DialogBase {
  return new DialogBase(type);
}

describe('MarkDown Editor Dialog PM', () => {
  it('Initializes the view', () => {
    const { view } = makeTestRig();
    expect(view).toBeCalled();
  });

  it('Sets up the VM when an MarkDownEditor is added to the repo', () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogMarkDownEditorDTO = {
      initialText: 'initial text',
      onConfirm: jest.fn(),
    };

    const markDownEditor = new DialogMarkDownEditor(data);
    repo.submitDialog(markDownEditor);

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as MarkDownEditorDialogVM;

    expect(vm.initialText).toEqual(data.initialText);
    expect(vm.confirm).toEqual(markDownEditor.confirm);
  });

  it('Goes back to null with the dialog is closed', () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogMarkDownEditorDTO = {
      initialText: 'initial text',
      onConfirm: jest.fn(),
    };
    const markDownEditor = new DialogMarkDownEditor(data);
    repo.submitDialog(markDownEditor);

    markDownEditor.confirm('MarkDown Text');
    view.mockClear();
    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
  });

  it('Unsubscribes from the MarkDownEditor after it is closed', () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogMarkDownEditorDTO = {
      initialText: 'initial text',
      onConfirm: jest.fn(),
    };
    const markDownEditor = new DialogMarkDownEditor(data);
    repo.submitDialog(markDownEditor);

    markDownEditor.confirm('MarkDown Text');
    repo.activeDialogHasClosed();
    view.mockClear();

    markDownEditor.notify();

    expect(view).not.toBeCalled();
  });

  it('Does not update if the dialog is not an MarkDownEditor', () => {
    const { view, repo } = makeTestRig();
    view.mockClear();
    repo.submitDialog(makeMockDialog('something other dialog'));

    expect(view).not.toBeCalled();
  });

  it('Updates the VM when the dialog changes', () => {
    const { view, repo } = makeTestRig();

    const data: DialogMarkDownEditorDTO = {
      initialText: 'initial text',
      onConfirm: jest.fn(),
    };
    const markDownEditor = new DialogMarkDownEditor(data);
    repo.submitDialog(markDownEditor);
    repo.submitDialog(makeMockDialog('something other dialog'));
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
  });

  it('Unsubscribes from the MarkDownEditor when dialog changes to something else', () => {
    const { view, repo } = makeTestRig();

    const data: DialogMarkDownEditorDTO = {
      initialText: 'initial text',
      onConfirm: jest.fn(),
    };
    const markDownEditor = new DialogMarkDownEditor(data);
    repo.submitDialog(markDownEditor);
    repo.submitDialog(makeMockDialog('something other dialog'));
    repo.activeDialogHasClosed();
    view.mockClear();

    markDownEditor.notify();
    expect(view).not.toBeCalled();
  });

  it('Unsubscribes from the MarkDownEditor when dialog changes to a different MarkDownEditor', () => {
    const { view, repo } = makeTestRig();

    const data1: DialogMarkDownEditorDTO = {
      initialText: 'initial text1',
      onConfirm: jest.fn(),
    };
    const markDownEditor1 = new DialogMarkDownEditor(data1);
    repo.submitDialog(markDownEditor1);

    const data2: DialogMarkDownEditorDTO = {
      initialText: 'initial text2',
      onConfirm: jest.fn(),
    };
    const markDownEditor2 = new DialogMarkDownEditor(data2);
    repo.submitDialog(markDownEditor2);

    repo.activeDialogHasClosed();
    view.mockClear();

    markDownEditor2.notify();
    expect(view).not.toBeCalled();
  });

  it('Updates the VM when it changes to a different MarkDownEditor', () => {
    const { view, repo } = makeTestRig();

    const data1: DialogMarkDownEditorDTO = {
      initialText: 'initial text1',
      onConfirm: jest.fn(),
    };
    const markDownEditor1 = new DialogMarkDownEditor(data1);
    repo.submitDialog(markDownEditor1);

    const data2: DialogMarkDownEditorDTO = {
      initialText: 'initial text2',
      onConfirm: jest.fn(),
    };
    const markDownEditor2 = new DialogMarkDownEditor(data2);
    repo.submitDialog(markDownEditor2);
    view.mockClear();

    repo.activeDialogHasClosed();
    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as MarkDownEditorDialogVM;

    expect(vm.initialText).toEqual(data2.initialText);
    expect(vm.confirm).toEqual(markDownEditor2.confirm);
  });

  it('Can be disposed', () => {
    const { view, repo, pm } = makeTestRig();

    const data: DialogMarkDownEditorDTO = {
      initialText: 'initial text',
      onConfirm: jest.fn(),
    };
    const markDownEditor = new DialogMarkDownEditor(data);
    repo.submitDialog(markDownEditor);
    view.mockClear();

    pm.dispose();

    markDownEditor.confirm('MarkDown Text');
    repo.activeDialogHasClosed();

    expect(view).not.toBeCalled();
  });
});

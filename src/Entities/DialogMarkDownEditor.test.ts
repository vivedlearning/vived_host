import { DialogMarkDownEditor, DialogMarkDownEditorDTO } from './DialogMarkDownEditor';

describe('MarkDown Editor Dialog', () => {
  it('Sets the open to false when cancel is called', () => {
    const data: DialogMarkDownEditorDTO = {
      onConfirm: jest.fn(),
      initialText: 'initial text',
    };

    const markDownEditor = new DialogMarkDownEditor(data);
    markDownEditor.isOpen = true;
    markDownEditor.cancel();

    expect(markDownEditor.isOpen).toEqual(false);
  });

  it('Sets the open to false when accept is called', () => {
    const data: DialogMarkDownEditorDTO = {
      onConfirm: jest.fn(),
      initialText: 'initial text',
    };

    const markDownEditor = new DialogMarkDownEditor(data);
    markDownEditor.isOpen = true;
    markDownEditor.confirm();

    expect(markDownEditor.isOpen).toEqual(false);
  });

  it('Calls the onAccept when accepted', () => {
    const data: DialogMarkDownEditorDTO = {
      onConfirm: jest.fn(),
      initialText: 'initial text',
    };

    const markDownEditor = new DialogMarkDownEditor(data);
    markDownEditor.confirm();

    expect(data.onConfirm).toBeCalled();
  });
});

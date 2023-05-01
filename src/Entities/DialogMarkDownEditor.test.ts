import { DialogMarkDownEditor, DialogMarkDownEditorDTO } from './DialogMarkDownEditor';

describe('MarkDown Editor Dialog', () => {
  it('Sets the open to false when cancel is called', () => {
    const data: DialogMarkDownEditorDTO = {
      onConfirm: jest.fn(),
      initialText: 'initial text',
    };

    const alert = new DialogMarkDownEditor(data);
    alert.isOpen = true;
    alert.cancel();

    expect(alert.isOpen).toEqual(false);
  });

  it('Sets the open to false when accept is called', () => {
    const data: DialogMarkDownEditorDTO = {
      onConfirm: jest.fn(),
      initialText: 'initial text',
    };

    const alert = new DialogMarkDownEditor(data);
    alert.isOpen = true;
    alert.confirm();

    expect(alert.isOpen).toEqual(false);
  });

  it('Calls the onAccept when accepted', () => {
    const data: DialogMarkDownEditorDTO = {
      onConfirm: jest.fn(),
      initialText: 'initial text',
    };

    const alert = new DialogMarkDownEditor(data);
    alert.confirm();

    expect(data.onConfirm).toBeCalled();
  });
});

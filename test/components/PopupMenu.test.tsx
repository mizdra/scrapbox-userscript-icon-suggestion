import { act, fireEvent, render } from '@testing-library/preact';
import { PopupMenu } from '../../src/components/PopupMenu';
import { CursorPosition } from '../../src/types';
import { createEditor } from '../helpers/html';
import '../mocks/resize-observer';

// ダミーの プロパティ
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const items = [<span key="1">item1</span>, <span key="2">item2</span>, <span key="3">item3</span>];

// テストに利用するイベント
const keydownEnterEvent = new KeyboardEvent('keydown', { key: 'Enter' });

// <QueryInput> は .editor 要素が document にあることを前提にしているので、 document に .editor を埋め込んでおく
const editor = createEditor();
document.body.appendChild(editor);

describe('PopupMenu', () => {
  describe('ポップアップが閉じている時', () => {
    test('.popup-menu が mount されていない', () => {
      const { queryByTestId } = render(<PopupMenu open={false} cursorPosition={cursorPosition} items={items} />);
      expect(queryByTestId('popup-menu')).toBeNull();
    });
    test('Enter を押下しても、onSelect も onSelectNonexistent も呼び出されない', async () => {
      const onSelect = jest.fn();
      const onSelectNonexistent = jest.fn();
      render(
        <PopupMenu
          open={false}
          cursorPosition={cursorPosition}
          items={items}
          onSelect={onSelect}
          onSelectNonexistent={onSelectNonexistent}
        />,
      );

      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      expect(onSelect).toBeCalledTimes(0);
      expect(onSelectNonexistent).toBeCalledTimes(0);
    });
  });
  describe('ポップアップが開いている時', () => {
    test('.popup-menu が mount されている', () => {
      const { queryByTestId } = render(<PopupMenu open cursorPosition={cursorPosition} items={items} />);
      expect(queryByTestId('popup-menu')).not.toBeNull();
    });
    describe('アイテムが1つも無い時', () => {
      test.todo('空であることを表すメッセージが表示される');
      test.todo('Enter 押下で onSelectNonexistent が呼び出される');
      test.todo('Escape 押下で onClose が呼び出される');
      test.todo(
        'Tab / Shift+Tab / Enter / Escape が押下されても、選択中のアイテムが変わったり、onSelect や onClose が呼び出されることがない',
      );
    });
    describe('アイテムが1つ以上ある時', () => {
      test.todo('Tab 押下で次のアイテムを選択できる');
      test.todo('Shift+Tab 押下で前のアイテムを選択できる');
      test.todo('Enter 押下で onSelect が呼び出される');
      test.todo('Escape 押下で onClose が呼び出される', () => {
        test.todo('ただし IME による変換中の Enter 押下では、何もしない');
      });
      test.todo('Tab / Shift+Tab / Enter / Escape 以外が押下されても、イベントはキャンセルされない');
    });
  });
});

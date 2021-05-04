import { act, fireEvent, render } from '@testing-library/preact';
import { datatype } from 'faker';
import { ComponentChild } from 'preact';
import { PopupMenu } from '../../src/components/PopupMenu';
import { CursorPosition } from '../../src/types';
import { createEditor } from '../helpers/html';
import '../mocks/resize-observer';

// ダミーの プロパティ
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const items = [<span key="1">item1</span>, <span key="2">item2</span>, <span key="3">item3</span>];

// テストに利用するイベント
const keydownEnterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
const keydownEscapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });

// <QueryInput> は .editor 要素が document にあることを前提にしているので、 document に .editor を埋め込んでおく
const editor = createEditor();
document.body.appendChild(editor);

describe('PopupMenu', () => {
  describe('ポップアップが閉じている時', () => {
    test('.popup-menu が mount されていない', () => {
      const { queryByTestId } = render(<PopupMenu open={false} cursorPosition={cursorPosition} items={items} />);
      expect(queryByTestId('popup-menu')).toBeNull();
    });
    test('Enter や Escape を押下しても、onSelect / onSelectNonexistent / onClose は呼び出されない', async () => {
      const onSelect = jest.fn();
      const onSelectNonexistent = jest.fn();
      const onClose = jest.fn();
      render(
        <PopupMenu
          open={false}
          cursorPosition={cursorPosition}
          items={items}
          onSelect={onSelect}
          onSelectNonexistent={onSelectNonexistent}
          onClose={onClose}
        />,
      );

      await act(() => {
        fireEvent(document, keydownEnterEvent);
        fireEvent(document, keydownEscapeEvent);
      });
      expect(onSelect).toBeCalledTimes(0);
      expect(onSelectNonexistent).toBeCalledTimes(0);
      expect(onClose).toBeCalledTimes(0);
    });
  });
  describe('ポップアップが開いている時', () => {
    test('.popup-menu が mount されている', () => {
      const { queryByTestId } = render(<PopupMenu open cursorPosition={cursorPosition} items={items} />);
      expect(queryByTestId('popup-menu')).not.toBeNull();
    });
    describe('アイテムが1つも無い時', () => {
      const items: ComponentChild[] = [];
      test('空であることを表すメッセージが表示される', () => {
        const emptyMessage = datatype.string();
        const { getByText } = render(
          <PopupMenu open cursorPosition={cursorPosition} items={items} emptyMessage={emptyMessage} />,
        );
        expect(getByText(emptyMessage)).toBeVisible();
      });
      test('Enter 押下で onSelectNonexistent が呼び出される', async () => {
        const onSelectNonexistent = jest.fn();
        render(
          <PopupMenu open cursorPosition={cursorPosition} items={items} onSelectNonexistent={onSelectNonexistent} />,
        );

        expect(onSelectNonexistent).toBeCalledTimes(0);
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(onSelectNonexistent).toBeCalledTimes(1);
      });
      test('Escape 押下で onClose が呼び出される', async () => {
        const onClose = jest.fn();
        render(<PopupMenu open cursorPosition={cursorPosition} items={items} onClose={onClose} />);

        expect(onClose).toBeCalledTimes(0);
        await act(() => {
          fireEvent(document, keydownEscapeEvent);
        });
        expect(onClose).toBeCalledTimes(1);
      });
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

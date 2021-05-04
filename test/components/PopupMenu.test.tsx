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
const keydownTabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
const keydownShiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
const keydownEnterWithComposingEvent = new KeyboardEvent('keydown', { key: 'Enter', isComposing: true });
const keydownAEvent = new KeyboardEvent('keydown', { key: 'a' });

// .editor 要素が document にあることを前提にしているので、 document に .editor を埋め込んでおく
const editor = createEditor();
document.body.appendChild(editor);

// keydown イベントが PopupMenu 側でキャンセルされずに突き抜けてきたことを確かめるための mock
const keydownListener = jest.fn();
document.addEventListener('keydown', keydownListener);
beforeEach(() => {
  keydownListener.mockClear();
});

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
    test('いかなるキーを押下しても、PopupMenu 側でキャンセルされない', async () => {
      render(<PopupMenu open={false} cursorPosition={cursorPosition} items={items} />);
      await act(() => {
        fireEvent(document, keydownEnterEvent);
        fireEvent(document, keydownEscapeEvent);
        fireEvent(document, keydownTabEvent);
        fireEvent(document, keydownShiftTabEvent);
        fireEvent(document, keydownEnterWithComposingEvent);
        fireEvent(document, keydownAEvent);
      });
      expect(keydownListener).toBeCalledTimes(6);
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
      test('Tab 押下で次のアイテムを選択できる', async () => {
        const { getByText } = render(<PopupMenu open cursorPosition={cursorPosition} items={items} />);
        expect(getByText('item1').parentElement).toHaveClass('selected');
        await act(() => {
          fireEvent(document, keydownTabEvent);
        });
        expect(getByText('item2').parentElement).toHaveClass('selected');
        await act(() => {
          fireEvent(document, keydownTabEvent);
        });
        expect(getByText('item3').parentElement).toHaveClass('selected');
        await act(() => {
          fireEvent(document, keydownTabEvent);
        });
        expect(getByText('item1').parentElement).toHaveClass('selected');
      });
      test('Shift+Tab 押下で前のアイテムを選択できる', async () => {
        const { getByText } = render(<PopupMenu open cursorPosition={cursorPosition} items={items} />);
        expect(getByText('item1').parentElement).toHaveClass('selected');
        await act(() => {
          fireEvent(document, keydownShiftTabEvent);
        });
        expect(getByText('item3').parentElement).toHaveClass('selected');
        await act(() => {
          fireEvent(document, keydownShiftTabEvent);
        });
        expect(getByText('item2').parentElement).toHaveClass('selected');
        await act(() => {
          fireEvent(document, keydownShiftTabEvent);
        });
        expect(getByText('item1').parentElement).toHaveClass('selected');
      });
      test('Enter 押下で onSelect が呼び出される', async () => {
        const onSelect = jest.fn();
        render(<PopupMenu open cursorPosition={cursorPosition} items={items} onSelect={onSelect} />);

        expect(onSelect).toBeCalledTimes(0);
        await act(() => {
          fireEvent(document, keydownTabEvent);
        });
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(onSelect).toBeCalledTimes(1);
        expect(onSelect).lastCalledWith(items[1], 1);

        // ただし IME による変換中の Enter 押下では、 onSelect は呼び出されない
        await act(() => {
          fireEvent(document, keydownEnterWithComposingEvent);
        });
        expect(onSelect).toBeCalledTimes(1);
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
      test('Tab / Shift+Tab / Enter / Escape 以外が押下された時はイベントがキャンセルされるが、それ以外ではキャンセルされない', async () => {
        render(<PopupMenu open={true} cursorPosition={cursorPosition} items={items} />);
        await act(() => {
          fireEvent(document, keydownEnterEvent);
          fireEvent(document, keydownEscapeEvent);
          fireEvent(document, keydownTabEvent);
          fireEvent(document, keydownShiftTabEvent);
          fireEvent(document, keydownEnterWithComposingEvent); // キャンセルされない
          fireEvent(document, keydownAEvent); // キャンセルされない
        });
        expect(keydownListener).toBeCalledTimes(2);
      });
    });
  });
});

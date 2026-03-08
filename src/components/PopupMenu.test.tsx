import { act, fireEvent, render } from '@testing-library/preact';
import { Icon } from '../lib/icon';
import {
  keydownEnterEvent,
  keydownEscapeEvent,
  keydownTabEvent,
  keydownShiftTabEvent,
  keydownEnterWithComposingEvent,
  keydownAEvent,
  keydownCtrlGEvent,
} from '../test/helpers/key';
import type { CursorPosition } from '../types';
import type { PopupMenuProps } from './PopupMenu';
import { PopupMenu } from './PopupMenu';

// ダミーの props
const cursorPosition: CursorPosition = { styleTop: 0, styleLeft: 0 };
const icons: Icon[] = [new Icon('project', 'icon1'), new Icon('project', 'icon2'), new Icon('project', 'icon3')];
const props: PopupMenuProps = {
  cursorPosition,
  icons,
  isClosePopupKey: (e) => {
    return e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey;
  },
};

// keydown イベントが PopupMenu 側でキャンセルされずに突き抜けてきたことを確かめるための mock
const keydownListener = vi.fn();
document.addEventListener('keydown', keydownListener);
beforeEach(() => {
  keydownListener.mockClear();
});

describe('PopupMenu', () => {
  test('.popup-menu が mount されている', () => {
    const { queryByTestId } = render(<PopupMenu {...props} />);
    expect(queryByTestId('popup-menu')).not.toBeNull();
  });
  describe('アイテムが1つも無い時', () => {
    const icons: Icon[] = [];
    test('空であることを表すメッセージが表示される', () => {
      const emptyMessage = 'test';
      const { getByText } = render(<PopupMenu {...props} icons={icons} emptyMessage={emptyMessage} />);
      expect(getByText(emptyMessage)).toBeVisible();
    });
    test('Enter を押下しても onSelect は呼び出されない', async () => {
      const onSelect = vi.fn();
      render(<PopupMenu {...props} icons={icons} onSelect={onSelect} />);
      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      expect(onSelect).toBeCalledTimes(0);
    });
    test('Escape 押下で onClose が呼び出される', async () => {
      const onClose = vi.fn();
      render(<PopupMenu {...props} icons={icons} onClose={onClose} />);

      expect(onClose).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(onClose).toBeCalledTimes(1);
    });
  });
  describe('アイテムが1つ以上ある時', () => {
    test('Tab 押下で次のアイテムを選択できる', async () => {
      const { getByText } = render(<PopupMenu {...props} />);
      expect(getByText('icon1').closest('.selected')).not.toBeNull();
      await act(() => {
        fireEvent(document, keydownTabEvent);
      });
      expect(getByText('icon2').closest('.selected')).not.toBeNull();
      await act(() => {
        fireEvent(document, keydownTabEvent);
      });
      expect(getByText('icon3').closest('.selected')).not.toBeNull();
      await act(() => {
        fireEvent(document, keydownTabEvent);
      });
      expect(getByText('icon1').closest('.selected')).not.toBeNull();
    });
    test('Shift+Tab 押下で前のアイテムを選択できる', async () => {
      const { getByText } = render(<PopupMenu {...props} />);
      expect(getByText('icon1').closest('.selected')).not.toBeNull();
      await act(() => {
        fireEvent(document, keydownShiftTabEvent);
      });
      expect(getByText('icon3').closest('.selected')).not.toBeNull();
      await act(() => {
        fireEvent(document, keydownShiftTabEvent);
      });
      expect(getByText('icon2').closest('.selected')).not.toBeNull();
      await act(() => {
        fireEvent(document, keydownShiftTabEvent);
      });
      expect(getByText('icon1').closest('.selected')).not.toBeNull();
    });
    test('Enter 押下で onSelect が呼び出される', async () => {
      const onSelect = vi.fn();
      render(<PopupMenu {...props} onSelect={onSelect} />);

      expect(onSelect).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownTabEvent);
      });
      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).lastCalledWith(icons[1], 1);

      // ただし IME による変換中の Enter 押下では、 onSelect は呼び出されない
      await act(() => {
        fireEvent(document, keydownEnterWithComposingEvent);
      });
      expect(onSelect).toBeCalledTimes(1);
    });
    test('Escape 押下で onClose が呼び出される', async () => {
      const onClose = vi.fn();
      render(<PopupMenu {...props} onClose={onClose} />);

      expect(onClose).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(onClose).toBeCalledTimes(1);
    });
    test('ポップアップを閉じるキーは isClosePopupKey でカスタマイズできる', async () => {
      const isClosePopupKey = (e: KeyboardEvent) => {
        return e.key === 'g' && e.ctrlKey && !e.shiftKey && !e.altKey;
      };
      const onClose = vi.fn();
      render(<PopupMenu {...props} onClose={onClose} isClosePopupKey={isClosePopupKey} />);

      expect(onClose).toBeCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownCtrlGEvent);
      });
      expect(onClose).toBeCalledTimes(1);
    });
    test('Tab / Shift+Tab / Enter / Escape 以外が押下された時はイベントがキャンセルされるが、それ以外ではキャンセルされない', async () => {
      render(<PopupMenu {...props} />);
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
    test('同名のページタイトルのアイコンが suggest されている場合は、括弧付きでプロジェクト名が表示される', () => {
      const { queryAllByTestId } = render(
        <PopupMenu
          {...props}
          icons={[
            new Icon('project', 'a'),
            new Icon('project', 'b'),
            new Icon('external-project-1', 'b'),
            new Icon('external-project-1', 'c'),
          ]}
        />,
      );
      const suggestedIconLabels = queryAllByTestId('suggested-icon-label');
      expect(suggestedIconLabels[0]).toHaveTextContent(/^a$/);
      expect(suggestedIconLabels[1]).toHaveTextContent(/^b \(project\)$/);
      expect(suggestedIconLabels[2]).toHaveTextContent(/^b \(external-project-1\)$/);
      expect(suggestedIconLabels[3]).toHaveTextContent(/^c$/);
    });
  });
});

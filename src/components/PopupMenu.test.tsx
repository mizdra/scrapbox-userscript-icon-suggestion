import { act, fireEvent } from '@testing-library/preact';
import { Icon } from '../lib/icon';
import {
  keydownEnterEvent,
  keydownTabEvent,
  keydownShiftTabEvent,
  keydownEnterWithComposingEvent,
  keydownAEvent,
} from '../test/helpers/key';
import { render } from '../test/renderer';
import type { PopupMenuProps } from './PopupMenu';
import { PopupMenu } from './PopupMenu';

// ダミーの props
const icons: Icon[] = [new Icon('project', 'icon1'), new Icon('project', 'icon2'), new Icon('project', 'icon3')];
const props: PopupMenuProps = {
  icons,
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
      const { getByText } = render(<PopupMenu {...props} icons={icons} />);
      expect(getByText('キーワードにマッチするアイコンがありません')).toBeVisible();
    });
    test('Enter を押下しても onSelect は呼び出されない', async () => {
      const onSelect = vi.fn();
      render(<PopupMenu {...props} icons={icons} onSelect={onSelect} />);
      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      expect(onSelect).toHaveBeenCalledTimes(0);
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

      expect(onSelect).toHaveBeenCalledTimes(0);
      await act(() => {
        fireEvent(document, keydownTabEvent);
      });
      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).lastCalledWith(icons[1], 1);

      // ただし IME による変換中の Enter 押下では、 onSelect は呼び出されない
      await act(() => {
        fireEvent(document, keydownEnterWithComposingEvent);
      });
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
    test('Tab / Shift+Tab / Enter 以外が押下された時はイベントがキャンセルされるが、それ以外ではキャンセルされない', async () => {
      render(<PopupMenu {...props} />);
      await act(() => {
        fireEvent(document, keydownEnterEvent);
        fireEvent(document, keydownTabEvent);
        fireEvent(document, keydownShiftTabEvent);
        fireEvent(document, keydownEnterWithComposingEvent); // キャンセルされない
        fireEvent(document, keydownAEvent); // キャンセルされない
      });
      expect(keydownListener).toHaveBeenCalledTimes(2);
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

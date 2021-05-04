import { fireEvent } from '@testing-library/dom';
import { renderHook, act } from '@testing-library/preact-hooks';
import { useDocumentEventListener } from '../../src/hooks/useDocumentEventListener';

describe('useDocumentEventListener', () => {
  const event = new KeyboardEvent('keydown', { key: 'Tab' });
  test('イベントリスナが設定できる', async () => {
    const listener = jest.fn();
    renderHook(() => useDocumentEventListener('keydown', listener));

    await act(() => {
      expect(listener).toHaveBeenCalledTimes(0);
      fireEvent(document, event);
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(event);
  });
  test('コンポーネントが unmount されるとイベントリスナが削除される', async () => {
    const listener = jest.fn();
    const { unmount } = renderHook(() => useDocumentEventListener('keydown', listener));

    unmount();

    await act(() => {
      fireEvent(document, event);
    });
    expect(listener).toHaveBeenCalledTimes(0);
  });
});

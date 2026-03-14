import { act, fireEvent } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import type { ComponentChild } from 'preact';
import { uniqueIcons } from '../lib/collection';
import { Icon } from '../lib/icon';
import type { Matcher } from '../lib/matcher';
import { forwardMatcher } from '../lib/matcher';
import { DEFAULT_IS_EXIT_ICON_SUGGESTION_KEY, DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY } from '../lib/options';
import { keydownAEvent, keydownCtrlLEvent, keydownEnterEvent, keydownEscapeEvent } from '../test/key';
import { render } from '../test/renderer';
import { App, type AppProps } from './App';

const presetIcons = [new Icon('project', 'b'), new Icon('project', 'c'), new Icon('project', 'c')];
const embeddedIcons = [new Icon('project', 'a'), new Icon('project', 'a'), new Icon('project', 'b')];
vi.spyOn(scrapbox.Project, 'name', 'get').mockReturnValue('project');

const props: AppProps = {
  isLaunchIconSuggestionKey: DEFAULT_IS_LAUNCH_ICON_SUGGESTION_KEY,
  isExitIconSuggestionKey: DEFAULT_IS_EXIT_ICON_SUGGESTION_KEY,
  presetIcons: presetIcons,
  matcher: forwardMatcher,
};

describe('App', () => {
  describe('初期状態', () => {
    test('ページリストに App を mount してもエラーが発生しない', () => {
      expect(() => render(<App {...props} />, { type: 'list' })).not.toThrow();
    });
    test('SuggestBox が表示されない', () => {
      const { queryByTestId } = render(<App {...props} />);
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('search-input')).toBeNull();
    });
    test('isLaunchIconSuggestionKey が真になるようなキーを押すと SuggestBox が表示される', async () => {
      const isLaunchIconSuggestionKey = (e: KeyboardEvent) => e.key === 'a';
      const { queryByTestId } = render(<App {...props} isLaunchIconSuggestionKey={isLaunchIconSuggestionKey} />, {
        cursorLineIndex: 0,
      });
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('search-input')).toBeNull();
      await act(() => {
        fireEvent(document, keydownAEvent);
      });
      expect(queryByTestId('popup-menu')).not.toBeNull();
      expect(queryByTestId('search-input')).not.toBeNull();
    });
  });
  describe('SuggestBox が表示されている時', () => {
    async function renderApp(ui: ComponentChild, options?: { embeddedIcons?: Icon[] }) {
      const renderResult = render(ui, {
        cursorLineIndex: 0,
        embeddedIcons: options?.embeddedIcons,
      });
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      return renderResult;
    }
    test('isExitIconSuggestionKey が真になるようなキーを押すと SuggestBox が閉じる', async () => {
      const isExitIconSuggestionKey = (e: KeyboardEvent) => e.key === 'Escape';
      const { queryByTestId } = await renderApp(<App {...props} isExitIconSuggestionKey={isExitIconSuggestionKey} />);
      expect(queryByTestId('popup-menu')).toBeInTheDocument();
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).not.toBeInTheDocument();
    });
    test('Enter を押すと選択中のアイコンが挿入される', async () => {
      const { getByTestId, getAllByTestId } = await renderApp(<App {...props} />, { embeddedIcons });
      const searchInput = getByTestId('search-input');

      expect(getAllByTestId('suggested-icon-label').map((icon) => icon.textContent)).toEqual(['a', 'b', 'c']); // a, b, c の 3アイコンが表示される
      await userEvent.type(searchInput, 'b');
      expect(getAllByTestId('suggested-icon-label').map((icon) => icon.textContent)).toEqual(['b']); // b だけ表示される
      await act(() => {
        fireEvent(document, keydownEnterEvent);
      });
      // TODO: アイコンが挿入されたかどうかを確認する
    });
    test('embeddedIcons や presetIcons の状態で matcher に渡される引数が変わる', async () => {
      const matcher: Matcher = vi.fn(() => []);
      await renderApp(<App {...props} matcher={matcher} />, { embeddedIcons });
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      expect(matcher).lastCalledWith({
        query: '',
        composedIcons: uniqueIcons([...embeddedIcons, ...presetIcons]),
        presetIcons: presetIcons,
        embeddedIcons: embeddedIcons,
      });
    });
  });
});

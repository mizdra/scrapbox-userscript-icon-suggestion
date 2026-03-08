import { act, fireEvent, render as nativeRender } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import type { ComponentChild } from 'preact';
import { ScrapboxContext } from '../contexts/ScrapboxContext';
import { uniqueIcons } from '../lib/collection';
import { Icon } from '../lib/icon';
import { forwardMatcher } from '../lib/matcher';
import { insertText } from '../lib/scrapbox';
import { fakeResolvedOptions } from '../test/faker';
import { createEditor, createScrapboxAPI } from '../test/helpers/html';
import { keydownAEvent, keydownCtrlLEvent, keydownEnterEvent, keydownEscapeEvent } from '../test/helpers/key';
import type { Matcher } from '../types';
import { App, type AppProps } from './App';

vi.mock('../lib/scrapbox', async (importOriginal) => {
  // oxlint-disable-next-line typescript/consistent-type-imports
  const mod: typeof import('../lib/scrapbox') = await importOriginal();
  return {
    ...mod,
    insertText: vi.fn(),
  };
});

const mockInsertText = vi.mocked(insertText);

const props: AppProps = fakeResolvedOptions({
  presetIcons: [new Icon('project', 'b'), new Icon('project', 'c'), new Icon('project', 'c')],
  matcher: forwardMatcher,
});

function render(ui: ComponentChild, options?: { embeddedIcons?: Icon[] }) {
  const editor = createEditor({
    embeddedIcons: options?.embeddedIcons ?? [
      new Icon('project', 'a'),
      new Icon('project', 'a'),
      new Icon('project', 'b'),
    ],
  });
  const scrapbox = createScrapboxAPI();
  return nativeRender(ui, {
    wrapper: ({ children }: { children: ComponentChild }) => (
      <ScrapboxContext.Provider value={{ editor, scrapbox }}>{children}</ScrapboxContext.Provider>
    ),
  });
}

beforeEach(() => {
  mockInsertText.mockReset();
});

describe('App', () => {
  describe('初期状態', () => {
    test('SuggestBox が表示されない', () => {
      const { container, queryByTestId } = render(<App {...props} />);
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('search-input')).toBeNull();
      expect(container).toBeEmptyDOMElement();
    });
    test('isLaunchIconSuggestionKey が真になるようなキーを押すと SuggestBox が表示される', async () => {
      const isLaunchIconSuggestionKey = (e: KeyboardEvent) => e.key === 'a';
      const { container, queryByTestId } = render(
        <App {...props} isLaunchIconSuggestionKey={isLaunchIconSuggestionKey} />,
      );
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('search-input')).toBeNull();
      await act(() => {
        fireEvent(document, keydownAEvent);
      });
      expect(queryByTestId('popup-menu')).toBeInTheDocument();
      expect(queryByTestId('search-input')).toBeInTheDocument();
      expect(container).not.toBeEmptyDOMElement();
    });
  });
  describe('SuggestBox が表示されている時', () => {
    async function renderApp(ui: ComponentChild, options?: { embeddedIcons?: Icon[] }) {
      const renderResult = render(ui, options);
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
    describe('Enter を押下した時', () => {
      // FIXME
      test.fails('アイテムがあれば選択中のアイコンが挿入される', async () => {
        const { getByTestId } = await renderApp(<App {...props} />);
        const buttonContainer = getByTestId('button-container');
        const searchInput = getByTestId('search-input');

        expect(buttonContainer.childElementCount).toEqual(3); // a, b, c の 3アイコンが表示される
        await userEvent.type(searchInput, 'b');
        expect(buttonContainer.childElementCount).toEqual(1); // b だけ表示される
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(mockInsertText).toBeCalledWith(expect.anything(), '[b.icon]');
      });
    });
  });

  describe('インテグレーションテスト', () => {
    describe('matcher', () => {
      test('embeddedIcons や presetIcons の状態で matcher に渡される引数が変わる', async () => {
        const presetIcons = [new Icon('project', 'b'), new Icon('project', 'c'), new Icon('project', 'c')];
        const embeddedIcons = [new Icon('project', 'a'), new Icon('project', 'a'), new Icon('project', 'b')];

        const matcher: Matcher = vi.fn(() => []);
        render(<App {...props} presetIcons={presetIcons} matcher={matcher} />, { embeddedIcons });
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
});

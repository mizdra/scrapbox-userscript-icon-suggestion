import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ScrapboxContext } from '../contexts/ScrapboxContext';
import { uniqueIcons } from '../lib/collection';
import { Icon } from '../lib/icon';
import { forwardMatcher } from '../lib/matcher';
import { insertText } from '../lib/scrapbox';
import { createEditor, createScrapboxAPI } from '../test/helpers/html';
import {
  keydownAEvent,
  keydownAltEnterEvent,
  keydownCtrlLEvent,
  keydownEnterEvent,
  keydownEscapeEvent,
} from '../test/helpers/key';
import type { Matcher } from '../types';
import type { AppProps } from './App';
import { App as NativeApp } from './App';

vi.mock('../lib/scrapbox', async (importOriginal) => {
  // oxlint-disable-next-line typescript/consistent-type-imports
  const mod: typeof import('../lib/scrapbox') = await importOriginal();
  return {
    ...mod,
    insertText: vi.fn(),
  };
});

const mockInsertText = vi.mocked(insertText);

// editor 上に埋め込まれるアイコンをカスタマイズしたいので、Context でラップする
type Options = { embeddedIcons?: Icon[] };
function App(props: AppProps & Options) {
  const presetIcons: Icon[] = props.presetIcons ?? [
    new Icon('project', 'b'),
    new Icon('project', 'c'),
    new Icon('project', 'c'),
  ];
  const editor = createEditor({
    embeddedIcons: props.embeddedIcons ?? [
      new Icon('project', 'a'),
      new Icon('project', 'a'),
      new Icon('project', 'b'),
    ],
  });
  const scrapbox = createScrapboxAPI();
  const matcher = forwardMatcher;
  return (
    <ScrapboxContext.Provider value={{ editor, scrapbox }}>
      <NativeApp presetIcons={presetIcons} defaultIsShownPresetIcons={false} matcher={matcher} {...props} />
    </ScrapboxContext.Provider>
  );
}

beforeEach(() => {
  mockInsertText.mockReset();
});

describe('App', () => {
  describe('初期状態', () => {
    test('SuggestBox が表示されない', () => {
      const { asFragment, queryByTestId } = render(<App />);
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('search-input')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
    test('isLaunchIconSuggestionKey が真になるようなキーを押すと SuggestBox が表示される', async () => {
      const isLaunchIconSuggestionKey = (e: KeyboardEvent) => e.key === 'a';
      const { asFragment, queryByTestId } = render(<App isLaunchIconSuggestionKey={isLaunchIconSuggestionKey} />);
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
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe('SuggestBox が表示されている時', () => {
    async function renderApp(props: AppProps & Options) {
      const renderResult = render(<App {...props} />);
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      return renderResult;
    }
    test('Escape 押下で SuggestBox が閉じる', async () => {
      const { queryByTestId } = await renderApp({});
      expect(queryByTestId('popup-menu')).toBeInTheDocument();
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).not.toBeInTheDocument();
    });
    describe('Enter を押下した時', () => {
      // FIXME
      test.fails('アイテムがあれば選択中のアイコンが挿入される', async () => {
        const { getByTestId } = await renderApp({});
        const buttonContainer = getByTestId('button-container');
        const searchInput = getByTestId('search-input');

        expect(buttonContainer.childElementCount).toEqual(2); // a, b の 2アイコンが表示される
        await userEvent.type(searchInput, 'b');
        expect(buttonContainer.childElementCount).toEqual(1); // b だけ表示される
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(mockInsertText).toBeCalledWith(expect.anything(), '[b.icon]');
      });
    });
    test('isLaunchIconSuggestionKey が真になるようなキーを押下したら、presetIcons が suggest される', async () => {
      const { getByTestId } = await renderApp({});
      const buttonContainer = getByTestId('button-container');

      expect(buttonContainer.childElementCount).toEqual(2); // a, b の 2アイコンが表示される
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      expect(buttonContainer.childElementCount).toEqual(3); // a, b, cccc の 3アイコンが表示される
    });
    // FIXME
    test.fails('isInsertQueryAsIconKey が真になるようなキーを押下したら、`[query.icon] が挿入される', async () => {
      const { getByTestId } = await renderApp({});
      const searchInput = getByTestId('search-input');

      await userEvent.type(searchInput, 'mizdra');
      await act(() => {
        fireEvent(document, keydownAltEnterEvent);
      });
      expect(mockInsertText).toBeCalledWith(expect.anything(), '[mizdra.icon]');
    });
    test('defaultIsShownPresetIcons が真なら最初からプリセットアイコンが suggest される', async () => {
      const { getByTestId } = await renderApp({ defaultIsShownPresetIcons: true });
      const buttonContainer = getByTestId('button-container');
      expect(buttonContainer.childElementCount).toEqual(3); // a, b, c の 3アイコンが表示される
    });
  });

  describe('インテグレーションテスト', () => {
    describe('matcher', () => {
      test('embeddedIcons や presetIcons、isShownPresetIcons の状態で matcher に渡される引数が変わる', async () => {
        const presetIcons = [new Icon('project', 'b'), new Icon('project', 'c'), new Icon('project', 'c')];
        const embeddedIcons = [new Icon('project', 'a'), new Icon('project', 'a'), new Icon('project', 'b')];

        const matcher: Matcher = vi.fn(() => []);
        render(
          <App
            defaultIsShownPresetIcons={false}
            presetIcons={presetIcons}
            embeddedIcons={embeddedIcons}
            matcher={matcher}
          />,
        );
        await act(() => {
          fireEvent(document, keydownCtrlLEvent);
        });
        expect(matcher).lastCalledWith({
          query: '',
          composedIcons: uniqueIcons(embeddedIcons),
          presetIcons: presetIcons,
          embeddedIcons: embeddedIcons,
        });

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

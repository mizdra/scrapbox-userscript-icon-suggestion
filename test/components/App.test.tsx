// jest.mock より先に定義したいので先頭に書く
// ref: https://github.com/facebook/jest/issues/11153#issuecomment-803639307
const mockInsertText = jest.fn();

import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { App as NativeApp, AppProps } from '../../src/components/App';
import { ScrapboxContext } from '../../src/contexts/ScrapboxContext';
import { uniqueIcons } from '../../src/lib/collection';
import { Icon } from '../../src/lib/icon';
import { forwardMatcher } from '../../src/lib/matcher';
import { Matcher } from '../../src/types';
import { createEditor, createScrapboxAPI } from '../helpers/html';
import {
  keydownAEvent,
  keydownAltEnterEvent,
  keydownCtrlLEvent,
  keydownEnterEvent,
  keydownEscapeEvent,
} from '../helpers/key';

jest.mock('../../src/lib/scrapbox', () => {
  return {
    ...jest.requireActual('../../src/lib/scrapbox'),
    insertText: mockInsertText,
  };
});

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
      <NativeApp presetIcons={presetIcons} defaultShowPresetIcons={false} matcher={matcher} {...props} />
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
      test('アイテムがあれば選択中のアイコンが挿入される', async () => {
        const { getByTestId } = await renderApp({});
        const buttonContainer = getByTestId('button-container');
        const searchInput = getByTestId('search-input');

        expect(buttonContainer.childElementCount).toEqual(2); // a, b の 2アイコンが表示される
        userEvent.type(searchInput, 'b');
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
    test('isInsertQueryAsIconKey が真になるようなキーを押下したら、`[query.icon] が挿入される', async () => {
      const { getByTestId } = await renderApp({});
      const searchInput = getByTestId('search-input');

      userEvent.type(searchInput, 'mizdra');
      await act(() => {
        fireEvent(document, keydownAltEnterEvent);
      });
      expect(mockInsertText).toBeCalledWith(expect.anything(), '[mizdra.icon]');
    });
    test('defaultShowPresetIcons が真なら最初からプリセットアイコンが suggest される', async () => {
      const { getByTestId } = await renderApp({ defaultShowPresetIcons: true });
      const buttonContainer = getByTestId('button-container');
      expect(buttonContainer.childElementCount).toEqual(3); // a, b, c の 3アイコンが表示される
    });
  });

  describe('インテグレーションテスト', () => {
    describe('matcher', () => {
      test('embeddedIcons や presetIcons、showPresetIcons の状態で matcher に渡される引数が変わる', async () => {
        const presetIcons = [new Icon('project', 'b'), new Icon('project', 'c'), new Icon('project', 'c')];
        const embeddedIcons = [new Icon('project', 'a'), new Icon('project', 'a'), new Icon('project', 'b')];

        const matcher: Matcher = jest.fn(() => []);
        render(
          <App
            defaultShowPresetIcons={false}
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

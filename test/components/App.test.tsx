// jest.mock より先に定義したいので先頭に書く
// ref: https://github.com/facebook/jest/issues/11153#issuecomment-803639307
const mockInsertText = jest.fn();

import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { App as NativeApp, AppProps } from '../../src/components/App';
import { ScrapboxContext } from '../../src/contexts/ScrapboxContext';
import { Icon } from '../../src/lib/icon';
import { forwardMatcher } from '../../src/lib/matcher';
import { createEditor, createScrapboxAPI } from '../helpers/html';
import { keydownAEvent, keydownCtrlLEvent, keydownEnterEvent, keydownEscapeEvent } from '../helpers/key';

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
      <NativeApp presetIcons={presetIcons} matcher={matcher} {...props} />
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
      expect(queryByTestId('query-input')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
    test('isSuggestionOpenKeyDown が真になるようなキーを押すと SuggestBox が表示される', async () => {
      const isSuggestionOpenKeyDown = (e: KeyboardEvent) => e.key === 'a';
      const { asFragment, queryByTestId } = render(<App isSuggestionOpenKeyDown={isSuggestionOpenKeyDown} />);
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByTestId('query-input')).toBeNull();
      await act(() => {
        fireEvent(document, keydownAEvent);
      });
      expect(queryByTestId('popup-menu')).toBeInTheDocument();
      expect(queryByTestId('query-input')).toBeInTheDocument();
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
        const queryInput = getByTestId('query-input');

        expect(buttonContainer.childElementCount).toEqual(2); // a, b の 2アイコンが表示される
        userEvent.type(queryInput, 'b');
        expect(buttonContainer.childElementCount).toEqual(1); // b だけ表示される
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(mockInsertText).toBeCalledWith(expect.anything(), '[b.icon]');
      });
    });
    test('isSuggestionOpenKeyDown が真になるようなキーを押下したら、presetIcons が suggest される', async () => {
      const { getByTestId } = await renderApp({});
      const buttonContainer = getByTestId('button-container');

      expect(buttonContainer.childElementCount).toEqual(2); // a, b の 2アイコンが表示される
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      expect(buttonContainer.childElementCount).toEqual(3); // a, b, cccc の 3アイコンが表示される
    });
    test('defaultSuggestPresetIcons が真なら最初からプリセットアイコンが suggest される', async () => {
      const { getByTestId } = await renderApp({ defaultSuggestPresetIcons: true });
      const buttonContainer = getByTestId('button-container');
      expect(buttonContainer.childElementCount).toEqual(3); // a, b, c の 3アイコンが表示される
    });
    test('同名のページタイトルのアイコンが suggest されている場合は、括弧付きでプロジェクト名が表示される', async () => {
      const { queryAllByTestId } = await renderApp({
        embeddedIcons: [
          new Icon('project', 'a'),
          new Icon('project', 'b'),
          new Icon('external-project-1', 'b'),
          new Icon('external-project-1', 'c'),
        ],
        presetIcons: [new Icon('external-project-2', 'c'), new Icon('external-project-2', 'd')],
      });
      const suggesteIconLabels1 = queryAllByTestId('suggested-icon-label');
      expect(suggesteIconLabels1[0]).toHaveTextContent(/^a$/);
      expect(suggesteIconLabels1[1]).toHaveTextContent(/^b \(project\)$/);
      expect(suggesteIconLabels1[2]).toHaveTextContent(/^b \(external-project-1\)$/);
      expect(suggesteIconLabels1[3]).toHaveTextContent(/^c$/);

      // プリセットアイコン表示
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });

      // プリセットアイコンが表示されている時は、プリセットアイコンを含めて同名のページタイトルのアイコンがあるかどうかが判定される
      const suggesteIconLabels2 = queryAllByTestId('suggested-icon-label');
      expect(suggesteIconLabels2[0]).toHaveTextContent(/^a$/);
      expect(suggesteIconLabels2[1]).toHaveTextContent(/^b \(project\)$/);
      expect(suggesteIconLabels2[2]).toHaveTextContent(/^b \(external-project-1\)$/);
      expect(suggesteIconLabels2[3]).toHaveTextContent(/^c \(external-project-1\)$/);
      expect(suggesteIconLabels2[4]).toHaveTextContent(/^c \(external-project-2\)$/);
      expect(suggesteIconLabels2[5]).toHaveTextContent(/^d$/);
    });
  });
});

// jest.mock より先に定義したいので先頭に書く
// ref: https://github.com/facebook/jest/issues/11153#issuecomment-803639307
const mockInsertText = jest.fn();

import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { App, AppProps } from '../src/App';
import { pagePathToIcon } from '../src/lib/icon';
import { Icon } from './../src/types';
import { createCursor, createEditor, createScrapboxAPI, createTextInput } from './helpers/html';
import { keydownAEvent, keydownCtrlLEvent, keydownEnterEvent, keydownEscapeEvent } from './helpers/key';

jest.mock('../src/lib/scrapbox', () => {
  return {
    ...jest.requireActual('../src/lib/scrapbox'),
    insertText: mockInsertText,
  };
});

// ダミーの props
const presetIcons: Icon[] = ['b', 'c', 'c'].map((pagePath) => pagePathToIcon('project', pagePath));
const editor = createEditor({ currentProjectName: 'project', iconPagePaths: ['a', 'a', 'b'] });
const textInput = createTextInput();
const cursor = createCursor({ styleLeft: 0, styleTop: 0 });
const scrapbox = createScrapboxAPI();
const props = { presetIcons, editor, textInput, cursor, scrapbox };

beforeEach(() => {
  mockInsertText.mockReset();
});

describe('App', () => {
  describe('初期状態', () => {
    test('SuggestBox が表示されない', () => {
      const { asFragment, queryByRole, queryByTestId } = render(<App {...props} />);
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByRole('textbox')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });
    test('isSuggestionOpenKeyDown が真になるようなキーを押すと SuggestBox が表示される', async () => {
      const isSuggestionOpenKeyDown = (e: KeyboardEvent) => e.key === 'a';
      const { asFragment, queryByRole, queryByTestId } = render(
        <App {...props} isSuggestionOpenKeyDown={isSuggestionOpenKeyDown} />,
      );
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).toBeNull();
      expect(queryByRole('textbox')).toBeNull();
      await act(() => {
        fireEvent(document, keydownAEvent);
      });
      expect(queryByTestId('popup-menu')).toBeInTheDocument();
      expect(queryByRole('textbox')).toBeInTheDocument();
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe('SuggestBox が表示されている時', () => {
    async function renderApp(props: AppProps) {
      const renderResult = render(<App {...props} />);
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      return renderResult;
    }
    test('Escape 押下で SuggestBox が閉じる', async () => {
      const { queryByTestId } = await renderApp({ ...props });
      expect(queryByTestId('popup-menu')).toBeInTheDocument();
      await act(() => {
        fireEvent(document, keydownEscapeEvent);
      });
      expect(queryByTestId('popup-menu')).not.toBeInTheDocument();
    });
    describe('Enter を押下した時', () => {
      test('アイテムが1つもなければ QueryInput に入力した pagePath のアイコンが挿入される', async () => {
        const { getByTestId } = await renderApp({ ...props, editor: createEditor(), presetIcons: [] });
        const queryInput = getByTestId('query-input');
        userEvent.type(queryInput, 'foo');
        expect(queryInput).toHaveValue('foo');
        await act(() => {
          fireEvent(document, keydownEnterEvent);
        });
        expect(mockInsertText).toBeCalledWith(expect.anything(), '[foo.icon]');
      });
      test('アイテムがあれば選択中のアイコンが挿入される', async () => {
        const { getByTestId } = await renderApp({ ...props });
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
      const { getByTestId } = await renderApp({ ...props });
      const buttonContainer = getByTestId('button-container');

      expect(buttonContainer.childElementCount).toEqual(2); // a, b の 2アイコンが表示される
      await act(() => {
        fireEvent(document, keydownCtrlLEvent);
      });
      expect(buttonContainer.childElementCount).toEqual(3); // a, b, c の 3アイコンが表示される
    });
  });
});

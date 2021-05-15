import { act, fireEvent, render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { App, AppProps } from '../src/App';
import { insertText } from '../src/lib/scrapbox';
import { Icon } from './../src/types';
import { createCursor, createEditor, createScrapboxAPI, createTextInput } from './helpers/html';
import { keydownAEvent, keydownCtrlLEvent, keydownEnterEvent, keydownEscapeEvent } from './helpers/key';

jest.mock('../src/lib/scrapbox', () => {
  return {
    ...jest.requireActual('../src/lib/scrapbox'),
    insertText: jest.fn(),
  };
});

// ダミーの props
const presetIcons: Icon[] = [];
const editor = createEditor();
const textInput = createTextInput();
const cursor = createCursor({ styleLeft: 0, styleTop: 0 });
const scrapbox = createScrapboxAPI();
const props = { presetIcons, editor, textInput, cursor, scrapbox };

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (insertText as any).mockReset();
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
        expect(insertText).toBeCalledWith(expect.anything(), '[foo.icon]');
      });
      test.todo('アイテムがあれば QueryInput に入力した pagePath のアイコンが挿入される');
    });
    test.todo('isSuggestionOpenKeyDown が真になるようなキーを押下したら、presetIcons が suggest される');
  });
});

import { act, fireEvent, render } from '@testing-library/preact';
import { App } from '../src/App';
import { Icon } from './../src/types';
import { createCursor, createEditor, createScrapboxAPI, createTextInput } from './helpers/html';
import { keydownAEvent, keydownEscapeEvent } from './helpers/key';

// ダミーの props
const presetIcons: Icon[] = [];
const editor = createEditor();
const textInput = createTextInput();
const cursor = createCursor({ styleLeft: 0, styleTop: 0 });
const scrapbox = createScrapboxAPI();
const props = { presetIcons, editor, textInput, cursor, scrapbox };

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
    test.todo('Escape 押下で SuggestBox が閉じる');
    describe('Enter を押下した時', () => {
      test.todo('アイテムが1つもなければ QueryInput に入力した pagePath のアイコンが挿入される');
      test.todo('アイテムがあれば QueryInput に入力した pagePath のアイコンが挿入される');
    });
    test.todo('isSuggestionOpenKeyDown が真になるようなキーを押下したら、presetIcons が suggest される');
  });
});

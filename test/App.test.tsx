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
  describe('open === true の時', () => {});
});

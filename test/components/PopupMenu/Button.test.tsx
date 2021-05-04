import { render } from '@testing-library/preact';
import { PopupMenuButton } from '../../../src/components/PopupMenu/Button';

describe('Button', () => {
  test('children が表示される', () => {
    const { getByText } = render(<PopupMenuButton>text</PopupMenuButton>);
    expect(getByText('text')).toBeInTheDocument();
  });
  test('selected === true の時、選択状態であることを表すクラスが付与される', () => {
    const { getByText } = render(<PopupMenuButton selected>text</PopupMenuButton>);
    expect(getByText('text')).toHaveClass('selected');
  });
});

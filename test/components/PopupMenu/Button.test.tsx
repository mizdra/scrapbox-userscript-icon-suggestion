import { render } from '@testing-library/preact';
import { PopupMenuButton } from '../../../src/components/PopupMenu/Button';

describe('Button', () => {
  test('children が表示される', () => {
    const { container } = render(<PopupMenuButton>text</PopupMenuButton>);
    expect(container).toMatchSnapshot();
  });
  test('selected === true の時、選択状態であることを表すクラスが付与される', () => {
    const { container } = render(<PopupMenuButton selected>text</PopupMenuButton>);
    expect(container).toMatchSnapshot();
  });
});

import { calcPopupMenuStyle, calcTriangleStyle } from '../../src/lib/calc-style';

describe('calcPopupMenuStyle', () => {
  test('.cursor の top プロパティがそのまま .popup-menu の top プロパティになる', () => {
    expect(calcPopupMenuStyle({ styleTop: 10, styleLeft: 20 })).toStrictEqual({
      top: 10,
    });
  });
});

describe('calcTriangleStyle', () => {
  test('.cursor の left プロパティがそのまま .popup-menu の left プロパティになる', () => {
    expect(calcTriangleStyle({ styleTop: 10, styleLeft: 20 }, false)).toStrictEqual({
      left: 20,
    });
  });
  test('isEmpty === true の時、ボーダーカラーが上書きされる', () => {
    expect(calcTriangleStyle({ styleTop: 10, styleLeft: 20 }, true)).toStrictEqual({
      left: 20,
      borderTopColor: '#555',
    });
  });
});

describe('calcButtonContainerStyle', () => {
  test.todo('エディタの中央にカーソルがあれば、.button-container を中央に表示するスタイルが返される');
  describe('エディタの左側にカーソルがあれば、.button-container を左側に表示するスタイルが返される', () => {
    test.todo('default');
    test.todo(
      '.button-container が左側に寄りすぎてウインドウからはみ出ないよう、一定以上は左に寄らないようになっている',
    );
  });
  describe('エディタの右側にカーソルがあれば、.button-container を右側に表示するスタイルが返される', () => {
    test.todo('default');
    test.todo(
      '.button-container が左側に寄りすぎてウインドウからはみ出ないよう、一定以上は左に寄らないようになっている',
    );
  });
  test.todo('isEmpty === true の時、ボタンが無いことを視覚的に表現するためのスタイルが返される');
});

describe('calcQueryInputStyle', () => {
  test.todo('エディタの中央にカーソルがあれば、<QueryInput> を中央に表示するスタイルが返される');
  test.todo('エディタの左側にカーソルがあれば、<QueryInput> を左側に表示するスタイルが返される');
  test.todo('エディタの右側にカーソルがあれば、<QueryInput> を右側に表示するスタイルが返される');
});

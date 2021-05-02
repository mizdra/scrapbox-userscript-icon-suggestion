import { calcPopupMenuStyle } from '../../src/lib/position';

describe('calcPopupMenuStyle', () => {
  test('.cursor の top プロパティがそのまま .popup-menu の top プロパティになる', () => {
    expect(calcPopupMenuStyle({ styleTop: 10, styleLeft: 20 })).toStrictEqual({
      top: 10,
    });
  });
});

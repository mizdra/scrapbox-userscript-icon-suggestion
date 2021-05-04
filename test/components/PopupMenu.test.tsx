describe('PopupMenu', () => {
  describe('ポップアップが閉じている時', () => {
    test.todo('.popup-menu が mount されていない');
    test.todo('Enter を押下しても、onSelect も onSelectNonexistent も呼び出されない');
  });
  describe('ポップアップが開いている時', () => {
    test.todo('.popup-menu が mount されている');
    test.todo('query に応じてアイテムがフィルタされる');
    describe('フィルタ後のアイテムが1つも無い時', () => {
      test.todo('空であることを表すメッセージが表示される');
      test.todo('Enter 押下で onSelectNonexistent が呼び出される');
      test.todo('Escape 押下で onClose が呼び出される');
      test.todo(
        'Tab / Shift+Tab / Enter / Escape が押下されても、選択中のアイテムが変わったり、onSelect や onClose が呼び出されることがない',
      );
    });
    describe('フィルタ後のアイテムが1つ以上ある時', () => {
      test.todo('Tab 押下で次のアイテムを選択できる');
      test.todo('Shift+Tab 押下で前のアイテムを選択できる');
      test.todo('Enter 押下で onSelect が呼び出される');
      test.todo('Escape 押下で onClose が呼び出される', () => {
        test.todo('ただし IME による変換中の Enter 押下では、何もしない');
      });
      test.todo('Tab / Shift+Tab / Enter / Escape 以外が押下されても、イベントはキャンセルされない');
    });
  });
});

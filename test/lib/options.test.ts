import { pagePathToIcon } from '../../src/lib/icon';
import { evaluatePresetIconItemsToIcons } from '../../src/lib/options';

describe('evaluatePresetIconItemsToIcons', () => {
  test('色んな型が入れ子になっていても、評価して flat して返してくれる', async () => {
    const icons = await evaluatePresetIconItemsToIcons('project', [
      'page1',
      ['page2', 'page3'],
      () => ['page4', 'page5'],
      // eslint-disable-next-line @typescript-eslint/require-await
      async () => ['page6', 'page7'],
      // eslint-disable-next-line @typescript-eslint/require-await
      () => ['page8', ['page9', 'page10'], () => ['page11'], async () => ['page12']],
    ]);
    expect(icons).toStrictEqual(
      [
        'page1',
        'page2',
        'page3',
        'page4',
        'page5',
        'page6',
        'page7',
        'page8',
        'page9',
        'page10',
        'page11',
        'page12',
      ].map((pagePath) => pagePathToIcon('project', pagePath)),
    );
  });
});

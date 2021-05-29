import { Icon, pagePathToIcon } from '../../src/lib/icon';
import { evaluatePresetIconItemsToIcons } from '../../src/lib/options';

describe('evaluatePresetIconItemsToIcons', () => {
  test('色んな型が入れ子になっていても、評価して flat して返してくれる', async () => {
    const icons = await evaluatePresetIconItemsToIcons([
      new Icon('project', 'page1'),
      [new Icon('project', 'page2'), new Icon('project', 'page3')],
      () => [new Icon('project', 'page4'), new Icon('project', 'page5')],
      // eslint-disable-next-line @typescript-eslint/require-await
      async () => [new Icon('project', 'page6'), new Icon('project', 'page7')],
      () => [
        new Icon('project', 'page8'),
        [new Icon('project', 'page9'), new Icon('project', 'page10')],
        () => [new Icon('project', 'page11')],
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => [new Icon('project', 'page12')],
      ],
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

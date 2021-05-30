import { getMemberIcons } from '../../src';

const dummyProjectJsonForPublicAndGuest = JSON.stringify({
  id: '60b26b8d86e09c001fe52364',
  name: 'icon-suggestion-example',
  displayName: 'icon-suggestion-example',
  publicVisible: true,
  loginStrategies: [],
  plan: null,
  theme: 'red',
  gyazoTeamsName: null,
  googleAnalyticsCode: null,
  created: 1622305677,
  updated: 1622306078,
  isMember: false,
});

const dummyMemberPageJsonForPublicAndGuest = JSON.stringify({
  id: '60b30f936e87a6001c3dc210',
  title: 'member',
  image: null,
  descriptions: [],
  user: {
    id: '599eb1bd0ce6b50011c75fd3',
    name: 'mizdra',
    displayName: 'mizdra',
    photo: 'https://lh3.googleusercontent.com/a-/AOh14GiDMA0MnvY98mtr_7XSAHgNwg2h7TJ734l3n6OtHg=s96-c',
  },
  pin: 0,
  views: 0,
  linked: 0,
  created: 1622347667,
  updated: 1622347667,
  accessed: 1622347667,
  snapshotCreated: null,
  pageRank: 0,
  persistent: false,
  lines: [
    {
      id: '60b30f936e87a6001c3dc210',
      text: 'member',
      userId: '599eb1bd0ce6b50011c75fd3',
      created: 1622347667,
      updated: 1622347667,
    },
  ],
  links: [],
  icons: [],
  files: [],
  relatedPages: {
    links1hop: [
      {
        id: '60b26bc1a08e44001c060a06',
        title: 'mizdra',
        titleLc: 'mizdra',
        image: 'https://scrapbox.io/files/60b26cae78ad6d001c26743a.png',
        descriptions: ['[https://scrapbox.io/files/60b26cae78ad6d001c26743a.png]', '#member'],
        linksLc: ['member'],
        linked: 0,
        updated: 1622305969,
        accessed: 1622305950,
      },
      {
        id: '60b26c35699cc8001c588760',
        title: '横から失礼する人',
        titleLc: '横から失礼する人',
        image:
          'https://3.bp.blogspot.com/-vk0LMKh8FAE/WI1zWAowOQI/AAAAAAABBYE/Uc2w7rK1-dgHzghomKwHoXNVJ-evy67WgCLcB/s800/yokokara_shitsurei.png',
        descriptions: [
          '#member',
          '[https://3.bp.blogspot.com/-vk0LMKh8FAE/WI1zWAowOQI/AAAAAAABBYE/Uc2w7rK1-dgHzghomKwHoXNVJ-evy67WgCLcB/s800/yokokara_shitsurei.png]',
          '[https://www.irasutoya.com/2017/02/blog-post_67.html 横から失礼する人のイラスト | かわいいフリー素材集 いらすとや]',
        ],
        linksLc: ['member'],
        linked: 0,
        updated: 1622305860,
        accessed: 1622305900,
      },
      {
        id: '60b26c74d6abdc0022d38acf',
        title: '元号を発表する人',
        titleLc: '元号を発表する人',
        image:
          'https://2.bp.blogspot.com/-c-Ws8qkxBq4/XKF92e4mmBI/AAAAAAABSHQ/YHiJQq1xOQwpQFXKHhrvZmPa4EhW6xCUQCLcBGAs/s800/gengou_happyou_reiwa.png',
        descriptions: [
          '#member',
          '[https://2.bp.blogspot.com/-c-Ws8qkxBq4/XKF92e4mmBI/AAAAAAABSHQ/YHiJQq1xOQwpQFXKHhrvZmPa4EhW6xCUQCLcBGAs/s800/gengou_happyou_reiwa.png]',
          '[https://www.irasutoya.com/2019/04/blog-post_34.html 元号を発表する人のイラスト（令和） | かわいいフリー素材集 いらすとや]',
        ],
        linksLc: ['member'],
        linked: 0,
        updated: 1622305924,
        accessed: 1622305916,
      },
      {
        id: '60b26c87e189b1001e5cd4e9',
        title: 'ショゴス',
        titleLc: 'ショゴス',
        image:
          'https://2.bp.blogspot.com/-jJSpcK3A7dU/WD_cNXY45bI/AAAAAAABAAU/RGRcIBv_m5sBj75VYInpNztHKKBZ0-vzQCLcB/s800/character_cthulhu_shoggoth.png',
        descriptions: [
          '#member',
          '[https://2.bp.blogspot.com/-jJSpcK3A7dU/WD_cNXY45bI/AAAAAAABAAU/RGRcIBv_m5sBj75VYInpNztHKKBZ0-vzQCLcB/s800/character_cthulhu_shoggoth.png]',
          '[https://www.irasutoya.com/2016/12/blog-post_840.html ショゴスのイラスト | かわいいフリー素材集 いらすとや]',
        ],
        linksLc: ['member'],
        linked: 0,
        updated: 1622305940,
        accessed: 1622305933,
      },
    ],
    links2hop: [],
    hasBackLinksOrIcons: true,
  },
  collaborators: [],
  lastAccessed: null,
});

describe('getMemberIcons', () => {
  test.todo('プロジェクトが存在しない時');
  describe('プロジェクトが private', () => {
    test.todo('そのプロジェクトのメンバーでない時');
    test.todo('そのプロジェクトのメンバーである時');
  });
  describe('プロジェクトが public', () => {
    test('そのプロジェクトのメンバーでない時', async () => {
      fetchMock.mockResponse(async (req) => {
        if (req.url.endsWith('/api/projects/project')) return Promise.resolve(dummyProjectJsonForPublicAndGuest);
        if (req.url.endsWith('/api/pages/project/member')) return Promise.resolve(dummyMemberPageJsonForPublicAndGuest);
        return Promise.reject(new Error('bad url'));
      });
      expect(await getMemberIcons('project')).toStrictEqual([]);
    });
    test.todo('そのプロジェクトのメンバーである時');
  });
});

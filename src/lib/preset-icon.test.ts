import {
  DUMMY_PROJECT_JSON_FOR_PUBLIC_AND_GUEST,
  DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_GUEST,
  MEMBER_PAGE_JSON_URL_RE,
  PROJECT_JSON_URL_RE,
  DUMMY_MEMBER_PAGE_JSON_FOR_NOT_EXISTS,
  DUMMY_PROJECT_JSON_FOR_NOT_EXISTS,
  DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_GUEST,
  DUMMY_PROJECT_JSON_FOR_PRIVATE_AND_GUEST,
  DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_MEMBER,
  DUMMY_PROJECT_JSON_FOR_PRIVATE_AND_MEMBER,
  DUMMY_PROJECT_JSON_FOR_PUBLIC_AND_MEMBER,
  DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_MEMBER,
  DUMMY_NON_EXIST_PAGE_JSON,
  NON_EXIST_PAGE_JSON_URL_RE,
} from '../test/fixtures/scrapbox-api';
import { Icon } from './icon';
import { fetchMemberPageIcons, fetchRelatedPageIconsByHashTag } from './preset-icon';

const fetchSpy = vi.spyOn(window, 'fetch');

function mockFetch(...routes: [RegExp, string][]) {
  fetchSpy.mockImplementation(async (input) => {
    for (const [re, body] of routes) {
      if (typeof input === 'string' && re.test(input)) return Promise.resolve(new Response(body));
    }
    throw new Error('unknown route');
  });
}

afterEach(() => {
  fetchSpy.mockReset();
});

describe('fetchMemberPageIcons', () => {
  test('プロジェクトが存在しない時', async () => {
    mockFetch(
      [PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_NOT_EXISTS],
      [MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_NOT_EXISTS],
    );
    await expect(fetchMemberPageIcons('project')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: You are not a member of \`project\` project.]`,
    );
  });
  describe('プロジェクトが private', () => {
    test('そのプロジェクトのメンバーでない時', async () => {
      mockFetch(
        [PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_PRIVATE_AND_GUEST],
        [MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_GUEST],
      );
      await expect(fetchMemberPageIcons('project')).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: You are not a member of \`project\` project.]`,
      );
    });
    test('そのプロジェクトのメンバーである時', async () => {
      mockFetch(
        [PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_PRIVATE_AND_MEMBER],
        [MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_MEMBER],
      );
      expect(await fetchMemberPageIcons('project')).toStrictEqual([new Icon('project', 'mizdra')]);
    });
  });
  describe('プロジェクトが public', () => {
    test('そのプロジェクトのメンバーでない時', async () => {
      mockFetch(
        [PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_PUBLIC_AND_GUEST],
        [MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_GUEST],
      );
      await expect(fetchMemberPageIcons('project')).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: You are not a member of \`project\` project.]`,
      );
    });
    test('そのプロジェクトのメンバーである時', async () => {
      mockFetch(
        [PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_PUBLIC_AND_MEMBER],
        [MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_MEMBER],
      );
      expect(await fetchMemberPageIcons('project')).toStrictEqual([new Icon('project', 'mizdra')]);
    });
  });
});

describe('fetchRelatedPageIconsByHashTag', () => {
  test('プロジェクトが存在しない時', async () => {
    mockFetch([MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_NOT_EXISTS]);
    await expect(fetchRelatedPageIconsByHashTag('project', 'member')).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: You are not a member of \`project\` project.]`,
    );
  });
  describe('プロジェクトが存在する時', () => {
    test('プロジェクトが private && そのプロジェクトのメンバーでない時', async () => {
      mockFetch([MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_GUEST]);
      await expect(fetchRelatedPageIconsByHashTag('project', 'member')).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: You are not a member of \`project\` project.]`,
      );
    });
    test('プロジェクトが public && そのプロジェクトのメンバーでない時', async () => {
      mockFetch([MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_GUEST]);
      expect(await fetchRelatedPageIconsByHashTag('project', 'member')).toStrictEqual([
        new Icon('project', 'mizdra'),
        new Icon('project', '横から失礼する人'),
      ]);
    });
    describe('そのプロジェクトのメンバーである時', () => {
      test('ハッシュタグがない時', async () => {
        mockFetch([NON_EXIST_PAGE_JSON_URL_RE, DUMMY_NON_EXIST_PAGE_JSON]);
        expect(await fetchRelatedPageIconsByHashTag('project', 'non-exist')).toStrictEqual([]);
      });
      test('ハッシュタグがある時', async () => {
        mockFetch([MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_MEMBER]);
        expect(await fetchRelatedPageIconsByHashTag('project', 'member')).toStrictEqual([
          new Icon('project', 'mizdra'),
          new Icon('project', '横から失礼する人'),
        ]);
      });
    });
  });
});

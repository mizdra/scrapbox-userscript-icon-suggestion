import { getMemberIcons } from '../../src';
import {
  DUMMY_PROJECT_JSON_FOR_PUBLIC_AND_GUEST,
  DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_GUEST,
  MEMBER_PAGE_JSON_URL_RE,
  PROJECT_JSON_URL_RE,
  DUMMY_MEMBER_PAGE_JSON_FOR_NOT_EXISTS,
  DUMMY_PROJECT_JSON_FOR_NOT_EXISTS,
  DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_GUEST,
  DUMMY_PROJECT_JSON_FOR_PRIVATE_AND_GUEST,
} from '../fixtures/scrapbox-api';

describe('getMemberIcons', () => {
  test('プロジェクトが存在しない時', async () => {
    fetchMock
      .doMockOnceIf(PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_NOT_EXISTS)
      .doMockOnceIf(MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_NOT_EXISTS);
    expect(await getMemberIcons('project')).toStrictEqual([]);
  });
  describe('プロジェクトが private', () => {
    test('そのプロジェクトのメンバーでない時', async () => {
      fetchMock
        .doMockOnceIf(PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_PRIVATE_AND_GUEST)
        .doMockOnceIf(MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PRIVATE_AND_GUEST);
      expect(await getMemberIcons('project')).toStrictEqual([]);
    });
    test.todo('そのプロジェクトのメンバーである時');
  });
  describe('プロジェクトが public', () => {
    test('そのプロジェクトのメンバーでない時', async () => {
      fetchMock
        .doMockOnceIf(PROJECT_JSON_URL_RE, DUMMY_PROJECT_JSON_FOR_PUBLIC_AND_GUEST)
        .doMockOnceIf(MEMBER_PAGE_JSON_URL_RE, DUMMY_MEMBER_PAGE_JSON_FOR_PUBLIC_AND_GUEST);
      expect(await getMemberIcons('project')).toStrictEqual([]);
    });
    test.todo('そのプロジェクトのメンバーである時');
  });
});

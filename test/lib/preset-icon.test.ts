import { getMemberIcons } from '../../src';
import { dummyProjectJsonForPublicAndGuest, dummyMemberPageJsonForPublicAndGuest } from '../fixtures/scrapbox-api';

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

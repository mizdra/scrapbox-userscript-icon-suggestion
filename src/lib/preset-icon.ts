import { Icon } from './icon';

/**
 * 指定されたプロジェクトに所属するメンバーのアイコンを全て取得する。
 * ただしユーザページがないユーザや、ユーザページにアイコンが埋め込まれていないユーザ、
 * ユーザページに member ハッシュタグが付いていないユーザは対象外とする。
 * また、この関数を実行するユーザがそのプロジェクトのメンバーではない場合など、
 * プロジェクトのメンバー情報にアクセスする権限を持っていない場合は、空配列が返る。
 * @param projectName メンバーの所属するプロジェクト
 * @returns 指定されたプロジェクトに所属するメンバーのアイコンのリスト
 */
export async function getMemberIcons(projectName: string): Promise<Icon[]> {
  const { origin } = window.location;

  const [projectJson, pagesJson]: [ProjectJson, PageJson] = await Promise.all([
    // プロジェクトに関する情報を取得
    fetch(`${origin}/api/projects/${projectName}`).then(async (res) => res.json()),
    // member ハッシュタグに関する情報を取得
    fetch(`${origin}/api/pages/${projectName}/member`).then(async (res) => res.json()),
  ]);

  // プロジェクトのメンバーでないなど、所属ユーザ情報にアクセスできない
  // ユーザからのリクエスト場合はそもそもプロパティが存在しない。
  if (!projectJson.users) return [];

  // プロジェクトに所属するユーザの名前一覧を取得
  const userNames = projectJson.users.map((user) => user.name);

  // userNames の内、ユーザページにアイコンがあるものを抽出
  const userNamesWithIcon = userNames.filter((userName) => {
    const link = pagesJson.relatedPages.links1hop.find((link) => link.title === userName);
    return link && link.image !== null;
  });
  return userNamesWithIcon.map((userName) => new Icon(projectName, userName));
}

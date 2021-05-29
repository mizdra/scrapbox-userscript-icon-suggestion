import { Icon } from './icon';

/**
 * 指定されたプロジェクトに所属するメンバーのアイコンを全て取得する。
 * ただしユーザページがないユーザや、ユーザページにアイコンが埋め込まれていないユーザは対象外とする。
 * また、この関数を実行するユーザがそのプロジェクトのメンバーではない場合など、
 * プロジェクトのメンバー情報にアクセスする権限を持っていない場合は、空配列が返る。
 * @param projectName メンバーの所属するプロジェクト
 * @returns 指定されたプロジェクトに所属するメンバーのアイコンのリスト
 */
export async function getMemberIcons(projectName: string): Promise<Icon[]> {
  const { origin } = window.location;

  // プロジェクトに所属するユーザの名前一覧を取得
  const userNames = await fetch(`${origin}/api/projects/${projectName}`)
    .then(async (res) => res.json())
    .then((json: ProjectJson) => (json.users ?? []).map((user) => user.name));

  // member ハッシュタグに関する情報を取得
  const pagesJson: PageJson = await fetch(`${origin}/api/pages/${projectName}/member`).then(async (res) => res.json());

  // userNames の内、ユーザページにアイコンがあるものを抽出
  const userNamesWithIcon = userNames.filter((userName) => {
    const link = pagesJson.relatedPages.links1hop.find((link) => link.title === userName);
    return link && link.image !== null;
  });
  return userNamesWithIcon.map((userName) => new Icon(projectName, userName));
}

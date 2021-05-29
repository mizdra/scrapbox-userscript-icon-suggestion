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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrapbox = (window as any).scrapbox as Scrapbox;

  const { origin } = window.location;

  // プロジェクトに所属するユーザの名前一覧を取得
  const userNames = await fetch(`${origin}/api/projects/${projectName}/`)
    .then(async (res) => res.json())
    .then((json: ProjectJson) => (json.users ?? []).map((user) => user.name));

  // userNames の内、ユーザページにアイコンがあるものを抽出
  const userNamesWithIcon = userNames.filter((userName) => {
    const page = scrapbox.Project.pages.find((page) => page.title === userName);
    return page && page.hasIcon;
  });
  return userNamesWithIcon.map((userName) => new Icon(projectName, userName));
}

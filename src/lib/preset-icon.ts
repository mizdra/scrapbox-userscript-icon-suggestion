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
export async function fetchMemberPageIcons(projectName: string): Promise<Icon[]> {
  const { origin } = window.location;

  const [projectJson, pageJson]: [ProjectJson, PageJson] = await Promise.all([
    // プロジェクトに関する情報を取得
    fetch(`${origin}/api/projects/${projectName}`).then(async (res) => res.json()),
    // member ハッシュタグに関する情報を取得
    fetch(`${origin}/api/pages/${projectName}/member`).then(async (res) => res.json()),
  ]);

  // プロジェクトのメンバーでない場合など、各種情報にアクセスできない場合は早期 return する
  const relatedPages = pageJson.relatedPages;
  if (!projectJson.users || !relatedPages) return [];

  // プロジェクトに所属するユーザの名前一覧を取得
  const userNames = projectJson.users.map((user) => user.name);

  // userNames の内、ユーザページにアイコンがあるものを抽出
  const userNamesWithIcon = userNames.filter((userName) => {
    const link = relatedPages.links1hop.find((link) => link.title === userName);
    return link && link.image !== null;
  });
  return userNamesWithIcon.map((userName) => new Icon(projectName, userName));
}

/**
 * 指定されたプロジェクトのハッシュタグにリンクされている全てのページのアイコンを取得する。
 * ただしハッシュタグからリンクされているページであっても、アイコンを持たないページは対象外とする。
 * @param projectName ハッシュタグのあるプロジェクト
 * @param hashTag ハッシュタグ名
 * @returns 指定されたプロジェクトのハッシュタグにリンクされている全てのページのアイコン
 */
export async function fetchRelatedPageIconsByHashTag(projectName: string, hashTag: string): Promise<Icon[]> {
  const { origin } = window.location;

  const pageJson: PageJson = await fetch(
    `${origin}/api/pages/${projectName}/${encodeURIComponent(hashTag)}`,
  ).then(async (res) => res.json());

  // プロジェクトのメンバーでない場合など、各種情報にアクセスできない場合は早期 return する
  if (!pageJson.relatedPages) return [];

  const pagesWithIcon = pageJson.relatedPages.links1hop.filter((page) => page.image !== null);

  return pagesWithIcon.map((page) => new Icon(projectName, page.title));
}

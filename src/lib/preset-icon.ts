import { Icon } from './icon';

/** https://scrapbox.io/api/projects/<project-name> を叩くと返ってくる JSON の型 */
interface ProjectJson {
  // プロジェクトのメンバーでないなど、所属ユーザ情報にアクセスできない
  // ユーザからのリクエスト場合はそもそもプロパティが存在しない。
  users?: ProjectJsonUser[];
}

interface ProjectJsonUser {
  name: string;
}
/** https://scrapbox.io/api/pages/<project-name>/<page-title> を叩くと返ってくる JSON の型 */
interface PageJson {
  // NOTE: プロジェクトのメンバーでない場合など、プロパティが存在しないことがある
  relatedPages?: RelatedPages;
}
interface RelatedPages {
  links1hop: Link[];
}

interface Link {
  title: string;
  image: string | null;
}

/**
 * 指定されたプロジェクトに所属するメンバーのアイコンを全て取得する。
 * ただしユーザページがないユーザや、ユーザページにアイコンが埋め込まれていないユーザ、
 * ユーザページに member ハッシュタグが付いていないユーザは対象外とする。
 * また、この関数を実行するユーザがそのプロジェクトのメンバーではない場合など、
 * プロジェクトの情報にアクセスする権限を持っていない場合は、例外が投げられる。
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

  // プロジェクトのメンバーでない場合など、各種情報にアクセスできない場合は例外を投げる
  // NOTE: 本当はプロジェクトが無い場合は `Project not found.` のようなエラーメッセージを出してほしいけど、
  //       手間なので雑に `You are not a member...` で統一している
  const relatedPages = pageJson.relatedPages;
  if (!projectJson.users || !relatedPages) throw new Error(`You are not a member of \`${projectName}\` project.`);

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
 * また、この関数を実行するユーザがそのプロジェクトのメンバーではない場合など、
 * プロジェクトの情報にアクセスする権限を持っていない場合は、例外が投げられる。
 * @param projectName ハッシュタグのあるプロジェクト
 * @param hashTag ハッシュタグ名
 * @returns 指定されたプロジェクトのハッシュタグにリンクされている全てのページのアイコン
 */
export async function fetchRelatedPageIconsByHashTag(projectName: string, hashTag: string): Promise<Icon[]> {
  const { origin } = window.location;

  const pageJson: PageJson = await fetch(`${origin}/api/pages/${projectName}/${encodeURIComponent(hashTag)}`).then(
    async (res) => res.json(),
  );

  // プロジェクトのメンバーでない場合など、各種情報にアクセスできない場合は例外を投げる
  // NOTE: 本当はプロジェクトが無い場合は `Project not found.` のようなエラーメッセージを出してほしいけど、
  //       手間なので雑に `You are not a member...` で統一している
  if (!pageJson.relatedPages) throw new Error(`You are not a member of \`${projectName}\` project.`);

  const pagesWithIcon = pageJson.relatedPages.links1hop.filter((page) => page.image !== null);

  return pagesWithIcon.map((page) => new Icon(projectName, page.title));
}

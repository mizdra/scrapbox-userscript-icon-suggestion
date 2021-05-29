interface Project {
  name: string;
}

interface Scrapbox {
  Layout: string;
  Project: Project;
}

// 本当はグローバルに露出しているが、コードベースの様々なところから無秩序に
// アクセスしてほしくないので、非公開にしている
// declare const scrapbox: Scrapbox;
// interface Window {
//   scrapbox: Scrapbox;
// }

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
  // プロジェクトのメンバーでないなど、所属ユーザ情報にアクセスできない
  // ユーザからのリクエスト場合はそもそもプロパティが存在しない。
  relatedPages: RelatedPages;
}

interface RelatedPages {
  links1hop: Link[];
}

interface Link {
  title: string;
  image: string | null;
}

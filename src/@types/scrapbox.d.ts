interface Page {
  title: string;
  hasIcon?: boolean;
}

interface Project {
  name: string;
  pages: Page[];
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

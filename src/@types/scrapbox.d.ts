interface Project {
  name: string;
}

interface Scrapbox {
  Project: Project;
}

// 本当はグローバルに露出しているが、コードベースの様々なところから無秩序に
// アクセスしてほしくないので、非公開にしている
// declare const scrapbox: Scrapbox;
// interface Window {
//   scrapbox: Scrapbox;
// }

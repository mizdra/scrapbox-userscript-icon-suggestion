interface Project {
  name: string;
}
type EventName = 'layout:changed' | 'project:changed';
declare global {
  interface ScrapboxAPI {
    Layout: string;
    Project: Project;
    addListener: (eventName: EventName, listener: () => void) => ScrapboxAPI;
    removeListener: (eventName: EventName, listener: () => void) => ScrapboxAPI;
  }
  var scrapbox: ScrapboxAPI;

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
}

interface RelatedPages {
  links1hop: Link[];
}

interface Link {
  title: string;
  image: string | null;
}

export {};

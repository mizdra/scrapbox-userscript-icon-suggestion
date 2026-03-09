interface Line {
  id: string;
  text: string;
}

interface Page {
  lines: Line[];
  updateLine(text: string, index: number): void;
}

interface Project {
  name: string;
}

type EventName = 'layout:changed' | 'project:changed' | 'lines:changed';

interface Scrapbox {
  Page: Page;
  Layout: string;
  Project: Project;
  addListener: (eventName: EventName, listener: () => void) => Scrapbox;
  removeListener: (eventName: EventName, listener: () => void) => Scrapbox;
}

declare const scrapbox: Scrapbox;
interface Window {
  scrapbox: Scrapbox;
}

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

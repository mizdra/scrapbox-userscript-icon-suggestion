import { Icon } from '../types';

/** アイコンを表すクラス */
export class Icon {
  /** アイコンが表すページが所属するプロジェクト名 */
  readonly projectName: string;
  /** アイコンが表すページのタイトル */
  readonly pageTitle: string;
  /**
   * `Icon` クラスのコンストラクタ
   * @param projectName アイコンが表すページが所属するプロジェクト名
   * @param pageTitle アイコンが表すページのタイトル
   */
  constructor(projectName: string, pageTitle: string) {
    this.projectName = projectName;
    this.pageTitle = pageTitle;
  }
  /**
   * アイコンが表すページのパスを返す。
   * `currentProjectName` に所属するアイコンの場合は 相対パス形式で、
   * そうでなければ絶対パス形式で返される。
   * */
  getShortPagePath(currentProjectName: string): string {
    if (this.projectName === currentProjectName) return this.pageTitle;
    return `/${this.projectName}/${this.pageTitle}`;
  }
  /** アイコンが表すページのパスを絶対パス形式で返す。 */
  get fullPagePath(): string {
    return `/${this.projectName}/${this.pageTitle}`;
  }
  /** アイコンを img タグにした時に alt 属性にセットされる値 */
  get imgAlt(): string {
    return this.pageTitle;
  }
  /** アイコンを img タグにした時に title 属性にセットされる値 */
  get imgTitle(): string {
    return this.pageTitle;
  }
  /** アイコンを img タグにした時に src 属性にセットされる値 */
  get imgSrc(): string {
    return `/api/pages/${this.projectName}/${encodeURIComponent(this.pageTitle)}/icon`;
  }
  /** アイコンが管理されているプロジェクト名 */
  getNotation(currentProjectName: string): string {
    return `[${this.getShortPagePath(currentProjectName)}.icon]`;
  }
  /** インスタンス同士が表すアイコンが一致するかどうか */
  equals(target: Icon): boolean {
    return this.fullPagePath === target.fullPagePath;
  }
}

export function pagePathToIcon(currentProjectName: string, pagePath: string): Icon {
  const isRoot = pagePath.startsWith(`/`);
  const projectName = isRoot ? pagePath.slice(1, pagePath.indexOf('/', 1)) : currentProjectName;
  const pageName = isRoot ? pagePath.slice(1 + projectName.length + 1) : pagePath;
  const isCurrentProjectIcon = projectName === currentProjectName;

  // '/current-project/' 始まりだったら '/current-project/' を切り取っておく
  const normalizedPagePath = isCurrentProjectIcon ? pageName : `/${projectName}/${pageName}`;
  return {
    pagePath: normalizedPagePath,
    imgAlt: pageName,
    imgTitle: pageName,
    imgSrc: `/api/pages/${projectName}/${encodeURIComponent(pageName)}/icon`,
    notation: `[${normalizedPagePath}.icon]`,
    projectName,
  };
}

export function iconLinkElementToIcon(currentProjectName: string, iconLinkElement: HTMLAnchorElement): Icon {
  const imgElement = iconLinkElement.querySelector<HTMLImageElement>('img.icon');
  if (!imgElement)
    throw new Error(
      `.icon.link の子要素 img.icon がありません。iconLinkElement.innnerHTML: ${iconLinkElement.innerHTML}`,
    );

  const isCurrentProjectIcon = iconLinkElement.pathname.startsWith(`/${currentProjectName}/`);
  const projectName = isCurrentProjectIcon
    ? currentProjectName
    : iconLinkElement.pathname.slice(1, iconLinkElement.pathname.indexOf('/', 1));

  const pagePath = isCurrentProjectIcon ? imgElement.alt : `/${projectName}/${imgElement.alt}`;
  return {
    pagePath: pagePath,
    imgAlt: imgElement.alt,
    imgTitle: imgElement.alt,
    // NOTE: imgSrc にはパスだけ設定する規約になっているが、HTMLImageElement#src には origin が含まれているので、
    // URL#pathname でパスだけ取り出してやる。
    imgSrc: new URL(imgElement.src, location.origin).pathname,
    notation: `[${pagePath}.icon]`,
    projectName,
  };
}

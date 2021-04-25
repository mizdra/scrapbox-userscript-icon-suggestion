import { Icon } from '../types';

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
  };
}

export function iconLinkElementToIcon(currentProjectName: string, iconLinkElement: HTMLAnchorElement): Icon {
  const imgElement = iconLinkElement.querySelector<HTMLImageElement>('img.icon')!;
  const isCurrentProjectIcon = iconLinkElement.pathname.startsWith(`/${currentProjectName}/`);
  const projectName = isCurrentProjectIcon
    ? currentProjectName
    : iconLinkElement.pathname.slice(1, iconLinkElement.pathname.indexOf('/', 1));

  const pagePath = isCurrentProjectIcon ? imgElement.alt : `/${projectName}/${imgElement.alt}`;
  return {
    pagePath: pagePath,
    imgAlt: imgElement.alt,
    imgTitle: imgElement.alt,
    imgSrc: imgElement.src,
    notation: `[${pagePath}.icon]`,
  };
}

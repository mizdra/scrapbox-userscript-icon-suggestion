import { Icon } from '../types';

export function pagePathToIcon(projectName: string, pagePath: string): Icon {
  return {
    pagePath: pagePath,
    imgAlt: pagePath,
    imgTitle: pagePath,
    imgSrc: pagePath.startsWith('/') ? `/api/pages${pagePath}/icon` : `/api/pages/${projectName}/${pagePath}/icon`,
  };
}

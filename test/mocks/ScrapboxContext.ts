import { createEditor, createScrapboxAPI } from '../helpers/html';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).scrapbox = createScrapboxAPI();
document.body.appendChild(createEditor());

import { createEditor, createScrapboxAPI } from '../helpers/html';

window.scrapbox = createScrapboxAPI();
document.body.appendChild(createEditor());

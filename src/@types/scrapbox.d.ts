interface Project {
  name: string;
}

interface Scrapbox {
  Project: Project;
}

declare const scrapbox: Scrapbox;

interface Window {
  scrapbox: Scrapbox;
}

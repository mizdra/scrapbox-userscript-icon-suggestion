interface Line {
  text: string;
}

interface Page {
  lines: Line[];
}
interface Project {
  name: string;
}

interface Scrapbox {
  Page: Page;
  Project: Project;
}

declare const scrapbox: Scrapbox;

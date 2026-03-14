declare global {
  interface ScrapboxProject {
    name: string;
  }
  type ScrapboxEventName = 'layout:changed' | 'project:changed';
  interface ScrapboxAPI {
    Layout: string;
    Project: ScrapboxProject;
    addListener: (eventName: ScrapboxEventName, listener: () => void) => ScrapboxAPI;
    removeListener: (eventName: ScrapboxEventName, listener: () => void) => ScrapboxAPI;
  }
  var scrapbox: ScrapboxAPI;
}
export {};

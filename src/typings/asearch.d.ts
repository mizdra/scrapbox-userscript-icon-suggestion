declare module 'asearch' {
  function Asearch(source: string): ((str: string, ambig: number) => boolean) & { source: string };
  export = Asearch;
}

export type FormData = {
  query: string;
};

export type Icon = {
  // ページの名前。'[done.icon]' という記法で書かれているアイコンなら、`pagePath === 'done'`。
  // '[/icons/done.icon]' なら `pagePath === '/icons/done'`。
  // '[a/b/c.icon]' なら `pagePath === 'a/b/c'`。
  // '[/icons/日本語.icon]' なら `pagePath === '/icons/日本語'`
  pagePath: string;
  imgAlt: string;
  imgTitle: string;
  imgSrc: string;
};

export type CursorPosition = {
  left: number;
  styleTop: number;
  styleLeft: number;
};

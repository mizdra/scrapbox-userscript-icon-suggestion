import { VNode } from 'preact';

export type PopupMenuButtonProps = {
  selected?: boolean;
  children: VNode;
};

export function PopupMenuButton<T extends VNode, U>({ children, selected }: PopupMenuButtonProps<T, U>) {
  return <div className={selected ? 'button selected' : 'button'}>{children}</div>;
}

import { VNode } from 'preact';

export type PopupMenuButtonProps = {
  selected?: boolean;
  children: VNode;
};

export function PopupMenuButton({ children, selected }: PopupMenuButtonProps) {
  return <div className={selected ? 'button selected' : 'button'}>{children}</div>;
}

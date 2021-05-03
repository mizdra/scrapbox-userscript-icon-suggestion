import { ComponentChildren } from 'preact';

export type PopupMenuButtonProps = {
  selected?: boolean;
  children: ComponentChildren;
};

export function PopupMenuButton({ children, selected }: PopupMenuButtonProps) {
  return <div className={selected ? 'button selected' : 'button'}>{children}</div>;
}

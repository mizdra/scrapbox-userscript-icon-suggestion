import { VNode } from 'preact';
import { Item } from '../PopupMenu';

export type PopupMenuButtonProps<T extends VNode, U> = {
  selected?: boolean;
  item: Item<T, U>;
};

export function PopupMenuButton<T extends VNode, U>({ item, selected }: PopupMenuButtonProps<T, U>) {
  return <div className={selected ? 'button selected' : 'button'}>{item.element}</div>;
}

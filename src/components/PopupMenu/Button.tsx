import { VNode } from 'preact';
import { Item } from '../PopupMenu';

export type PopupMenuButtonProps<T extends VNode> = {
  selected?: boolean;
  item: Item<T>;
};

export function PopupMenuButton<T extends VNode>({ item, selected }: PopupMenuButtonProps<T>) {
  return <div className={selected ? 'button selected' : 'button'}>{item.element}</div>;
}

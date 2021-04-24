import { FunctionComponent } from 'preact';
import { Icon } from '../../types';

export type PopupMenuButtonProps = {
  selected?: boolean;
  icon: Icon;
};

export const PopupMenuButton: FunctionComponent<PopupMenuButtonProps> = ({ icon, selected }) => {
  return (
    <div className={selected ? 'button selected' : 'button'}>
      <span>
        <img
          alt={icon.imgAlt}
          title={icon.imgTitle}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={icon.imgSrc}
        />
        {' ' + icon.pagePath}
      </span>
    </div>
  );
};

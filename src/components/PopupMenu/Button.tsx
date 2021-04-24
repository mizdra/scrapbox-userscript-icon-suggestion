import { FunctionComponent } from 'preact';
import { Icon } from '../../types';

export type PopupMenuButtonProps = {
  icon: Icon;
};

export const PopupMenuButton: FunctionComponent<PopupMenuButtonProps> = ({ icon }) => {
  return (
    <div className="button">
      <span>
        <img
          alt={icon.imgAlt}
          title={icon.imgTitle}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={icon.imgSrc}
        />
        {icon.pagePath}
      </span>
    </div>
  );
};

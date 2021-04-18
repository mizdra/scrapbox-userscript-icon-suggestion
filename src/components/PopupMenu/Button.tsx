import { IconNode } from '@progfay/scrapbox-parser';
import { FunctionComponent } from 'preact';
import { generateIconSrc } from '../../lib/scrapbox';

export type PopupMenuButtonProps = {
  icon: IconNode;
};

export const PopupMenuButton: FunctionComponent<PopupMenuButtonProps> = ({ icon }) => {
  return (
    <div className="button">
      <span>
        <img
          alt={icon.path}
          title={icon.path}
          style="width: 1.3em; height: 1.3em; object-fit: contain;"
          src={generateIconSrc(icon, scrapbox.Project.name)}
        />
      </span>
    </div>
  );
};

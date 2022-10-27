import { Link } from 'react-router-dom';
import { listCollections, Collection } from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';
import { useNavigate } from 'react-router';
import classes from './Collections.module.scss';
import { FC, MouseEventHandler } from 'react';

export const CollectionsList = () => {
  usePageTitle('Data Collections');
  const collections = listCollections.useQuery();
  return (
    <div className={classes['collection_wrapper']}>
      <div>
        Some text explaining to users what they are looking at would go here.
        Between this and the list below, we may add search/sort/etc inputs. We
        may also add some sort of pagination at the bottom of the list.
      </div>
      <ul className={classes['collection_list']}>
        {collections.isSuccess
          ? collections.data?.map((collection) => (
              <CollectionListItem key={collection.id} collection={collection} />
            ))
          : null}
      </ul>
    </div>
  );
};

const CollectionListItem: FC<{ collection: Collection }> = ({ collection }) => {
  const navigate = useNavigate();
  const detailLink = encodeURIComponent(collection.id);

  const handleClick: MouseEventHandler<HTMLLIElement | HTMLImageElement> = (
    ev
  ) => {
    if (ev.currentTarget !== ev.target) return;
    navigate(detailLink);
  };

  return (
    <li onClick={handleClick}>
      <img
        src={collection.icon}
        alt={`${collection.name} collection icon`}
        onClick={handleClick}
      />
      <div className={classes['desc']}>
        <Link className={classes['desc_title']} to={detailLink}>
          {collection.name}
        </Link>
        <span className={classes['desc_text']}>
          Where the description goes {collection.source_version}
        </span>
      </div>
    </li>
  );
};

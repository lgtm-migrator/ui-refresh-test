import { usePageTitle } from '../../common/hooks';
import { useParams } from 'react-router-dom';

interface ParamTypes {
  category: string;
  id: string;
  obj: string;
  ver: string;
}

export default function Navigator() {
  usePageTitle('Narrative Navigator');
  const { category, id, obj, ver } = useParams<ParamTypes>();
  return (
    <section>
      category: {category}
      id: {id}
      obj: {obj}
      ver: {ver}
    </section>
  );
}

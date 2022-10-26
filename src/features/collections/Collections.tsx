import { Route, Routes } from 'react-router-dom';
import { CollectionDetail } from './CollectionDetail';
import { CollectionsList } from './CollectionsList';

export default function Collections() {
  return (
    <Routes>
      <Route path="/" element={<CollectionsList />} />
      <Route path="/:id" element={<CollectionDetail />} />
      <Route path="*" element={<span>hmmm</span>} />
    </Routes>
  );
}

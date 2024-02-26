'use client';
import { useState } from 'react';

export const metadata = {
  title: 'Search',
};

const Search = () => {
  const [user, setUser] = useState<[]>([]);
  return (
    <>
      <h1>검색</h1>
    </>
  );
};

export default Search;

import SearchComponent from '@/components/search/SearchComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Search',
    template: '%s | SNS',
  },
};

const Search = () => {
  return (
    <>
      <SearchComponent />
    </>
  );
};

export default Search;

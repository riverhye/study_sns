import RankComponent from '@/components/ranking/RankComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Ranking',
    template: '%s | SNS',
  },
};

const Ranking = () => {
  return (
    <div className="flex  w-full justify-center flex-col align-middle">
      <RankComponent />
    </div>
  );
};

export default Ranking;

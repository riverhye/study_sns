import Icons from '@/public/assets/HeaderIcons';
import Link from 'next/link';

const Category = () => {
  const { HomeIcon, SearchIcon, StudyIcon, RankIcon, LikeIcon } = Icons;

  return (
    <ul className="mt-10">
      <Link href={`/`}>
        <li className="transition ease-in-out delay-50 mb-1 text-lg hover:scale-110s hover:font-bold hover:bg-opacity-20 hover:bg-slate-50 rounded-md pl-3 py-2">
          <HomeIcon />
          <span className="text-white">홈</span>
        </li>
      </Link>
      <Link href={``}>
        <li className="transition ease-in-out delay-50 mb-1 text-lg hover:font-bold hover:bg-opacity-20 hover:bg-slate-50 rounded-md pl-3 py-2">
          <SearchIcon />
          <span className="text-white">검색</span>
        </li>
      </Link>
      <Link href={``}>
        <li className="transition ease-in-out delay-50 mb-1 text-lg hover:font-bold hover:bg-opacity-20 hover:bg-slate-50 rounded-md pl-3 py-2">
          <StudyIcon />
          <span className="text-white">내 공부</span>
        </li>
      </Link>
      <Link href={``}>
        <li className="transition ease-in-out delay-50 text-lg hover:font-bold hover:bg-opacity-20 hover:bg-slate-50 rounded-md pl-3 py-2">
          <RankIcon />
          <span className="text-white">랭킹</span>
        </li>
      </Link>
      <Link href={``}>
        <li className="transition ease-in-out delay-50 text-lg hover:font-bold hover:bg-opacity-20 hover:bg-slate-50 rounded-md pl-3 py-2">
          {/* { 알림 있음 && } */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute top-1 left-5 inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex top-1 left-5 rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <LikeIcon />
          <span className="text-white">알림</span>
        </li>
      </Link>
      <Link href={`/home`}>임시 로그인홈</Link>
    </ul>
  );
};

export default Category;

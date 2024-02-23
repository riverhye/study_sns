import Icons from '@/public/images/HeaderIcons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Categories } from '@/type/type';

const Category = () => {
  const { HomeIcon, SearchIcon, StudyIcon, RankIcon, LikeIcon } = Icons;
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const token = localStorage.getItem('accessToken');
  // token과 닉네임..
  const nickname = localStorage.getItem('accessToken');

  // TODO : 클릭한 컴포넌트에만 props 넘기기
  const items: Categories[] = [
    { href: '/', text: '홈', svgComponent: <HomeIcon color={selectedCategory === 0 ? 'white' : 'none'} /> },
    { href: '/', text: '검색', svgComponent: <SearchIcon color={selectedCategory === 1 ? 'white' : 'none'} /> },
    {
      href: `${token ? `/study/${nickname}` : '/'}`,
      text: '내 공부',
      svgComponent: <StudyIcon color={selectedCategory === 2 ? 'white' : 'none'} />,
    },
    { href: '/', text: '랭킹', svgComponent: <RankIcon color={selectedCategory === 3 ? 'white' : 'none'} /> },
    { href: '/', text: '알림', svgComponent: <LikeIcon color={selectedCategory === 4 ? 'white' : 'none'} /> },
  ];
  const handleClick = (index: number) => {
    setSelectedCategory(prevSelected => (prevSelected === index ? 0 : index));
  };

  return (
    <ul className="mt-10">
      {items.map((item, index) => (
        <Link href={item.href} key={index}>
          {item.text === '알림' && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute top-4 left-11 inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <span className="relative inline-flex top-4 left-11 rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <li
            className={`flex items-center rounded-md py-2 mx-0 ${item.text !== '랭킹' && 'mb-1'} ${selectedCategory === index && 'font-bold'} text-lg hover:font-bold hover:bg-opacity-20 hover:bg-slate-50 transition ease-in-out delay-50 `}
            onClick={() => handleClick(index)}>
            <div className="inline-flex pl-3 box-content">{item.svgComponent}</div>
            <span className="text-white ml-5 text-lg">{item.text}</span>
          </li>
        </Link>
      ))}
      <Link href={`/home`}>임시 로그인홈</Link>
    </ul>
  );
};

export default Category;

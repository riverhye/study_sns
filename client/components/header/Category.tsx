import Link from 'next/link';

const Category = () => {
  return (
    <ul className="mt-10">
      <Link href={`/`}>
        <li className="text-xl mb-3">🟢홈</li>
      </Link>
      <li className="text-xl mb-3">검색</li>
      <li className="text-xl mb-3">내 공부</li>
      <li className="text-xl mb-3">랭킹</li>
      <li className="text-xl mb-3">알림</li>
    </ul>
  );
};

export default Category;

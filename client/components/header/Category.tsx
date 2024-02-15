import Link from 'next/link';

const Category = () => {
  return (
    <ul className="mt-10">
      <Link href={`/`}>
        <li className="text-xl mb-3 hover:font-semibold">🟢홈</li>
      </Link>
      <li className="text-xl mb-3 hover:font-semibold">검색</li>
      <li className="text-xl mb-3 hover:font-semibold ease-in-out duration-100">내 공부</li>
      <li className="text-xl mb-3 hover:font-semibold ease-in-out duration-100">랭킹</li>
      <li className="text-xl mb-3 hover:font-semibold ease-in-out duration-100">알림</li>
    </ul>
  );
};

export default Category;

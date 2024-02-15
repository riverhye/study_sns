import Link from 'next/link';

const HeaderTop = () => {
  const dummies = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div className="bg-gray-400 h-32 p-4">
      <div className="flex items-center">
        {dummies.map((dum, index) => (
          <div className="flex flex-col items-center mx-5 relative">
            {index < 3 ? (
              <div className="absolute left-1 top-0 text-xl text-amber-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {index + 1}
              </div>
            ) : (
              ''
            )}
            <Link href={`/`}>
              <div className="border-2 rounded-full w-20 h-20 ">
                <img src="" alt="" />
              </div>
            </Link>
            <div className="mt-1 text-sm">닉네임</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderTop;

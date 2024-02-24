'use client';

import Category from './Category';
import Timer from './Timer';
import TodoHeader from './TodoHeader';

const HeaderLeft = () => {
  return (
    <>
      <div className="flex flex-col h-auto 1/12  px-4 bg-main-blue p-0">
        <Category />
        <TodoHeader />
        <Timer />
      </div>
    </>
  );
};

export default HeaderLeft;

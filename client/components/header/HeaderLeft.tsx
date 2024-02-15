import Category from './Category';
import Timer from './Timer';
import TodoHeader from './TodoHeader';

const HeaderLeft = () => {
  return (
    <>
      <div className="flex flex-grow flex-col h-auto w-1/12 border-2 min-w-72 p-9">
        <Category />
        <TodoHeader />
        <Timer />
        <div className="w-32"></div>
      </div>
    </>
  );
};

export default HeaderLeft;

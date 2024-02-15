import Feed from '../Feed';

const HomeFeed = () => {
  return (
    <>
      <section>
        <div className="flex justify-center h-12 w-full">
          <input className="w-1/2 outline-none rounded-md shadow-sm block indent-3 focus:outline-none focus:ring-sky-500 focus:ring-1 focus:border-sky-500  placeholder:text-slate-400" />
          <button className="w-32 border-2 rounded-full">시작</button>
        </div>
        <Feed />
      </section>
    </>
  );
};

export default HomeFeed;

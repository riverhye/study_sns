const LoadingCom = () => {
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="w-4 h-4 rounded-full mx-2 bg-main-blue animate-[wave_0.5s_ease-in-out_infinite_alternate]"></div>
        <div className="w-4 h-4 rounded-full mx-2 bg-strong-yellow animate-[wave_0.5s_ease-in-out_infinite_100ms_alternate]"></div>
        <div className="w-4 h-4 rounded-full mx-2 bg-gray-500 animate-[wave_0.5s_ease-in-out_infinite_200ms_alternate]"></div>
      </div>
    </>
  );
};

export default LoadingCom;

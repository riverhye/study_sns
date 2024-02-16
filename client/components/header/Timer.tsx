const Timer = () => {
  return (
    <>
      <div className="flex">
        <div className="w-16 h-16 rounded-full border-2">
          <img src="" alt="" />
        </div>
        <div className="flex flex-col justify-center ml-6">
          <span>닉네임</span>
          <div className="text-2xl">00:00:00</div>
        </div>
      </div>
    </>
  );
};

export default Timer;

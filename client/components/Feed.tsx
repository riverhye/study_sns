const Feed = () => {
  const dummies = [
    {
      nickname: '어쩌고',
      content: '리액트',
      type: '시작했습니다.',
    },
    { nickname: '맞는데요', content: '게임', type: '마쳤습니다.' },
  ];
  return (
    <section>
      <div className="p-10 to-red-500">
        {dummies.map((dum, index) => (
          <>
            <div className="p-4 border-2 my-10">
              <div className="flex items-center">
                <div className="w-14 h-14  rounded-full border-2">
                  <img src="" alt="" />
                </div>
                <div className="ml-2">{dum.nickname}</div>
              </div>
              <div className="mt-2">
                {dum.nickname}님이 {dum.content} 공부를 {dum.type}
              </div>
            </div>
          </>
        ))}
      </div>
    </section>
  );
};

export default Feed;

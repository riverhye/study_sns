import UpdateFeed from './UpdateFeed';
// import { UserFeedProps } from '@/type/type';

interface UserFeedProps {
  feedData?: {
    nickname: string;
    image: string;
    content: string;
    type: string;
  }[];
}

const FeedContent = (props: UserFeedProps) => {
  // TODO : type에 담긴 (start, end, like, follow) string으로 변경
  const feeds = props.feedData || [
    {
      nickname: '어쩌고',
      content: '리액트',
      type: '시작했습니다.',
      image: 'image1',
    },
    { nickname: '맞는데요', content: '게임', type: '마쳤습니다.', image: 'image2' },
  ];

  return (
    <section>
      <div className="p-10 to-red-500">
        {feeds.map((feed, index) => (
          <>
            <div key={index} className="p-4 border-2 my-10">
              <div className="flex items-center">
                <div className="w-14 h-14  rounded-full border-2">
                  <img src={feed.image} alt="img" />
                </div>
                <div className="ml-2">{feed.nickname}</div>
              </div>
              <div className="mt-2">
                {feed.nickname}님이 {feed.content} 공부를 {feed.type}
              </div>
            </div>
          </>
        ))}
      </div>
    </section>
  );
};

export default FeedContent;

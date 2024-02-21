import React, { ReactNode } from 'react';
import { UserFeedData } from '@/type/type';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface UserFeedProps {
  feedData?: UserFeedData[];
  initialFeedData: UserFeedData[]; // temp
  handleLike: (index: number) => void;
}

const FeedContent = (props: UserFeedProps) => {
  // TODO : type에 담긴 (start, end, like, follow) string으로 변경

  const dateDistance = (date: Date): ReactNode => {
    const now = Date.now();
    const d = new Date(date);
    const timeDiff = (now - d.getTime()) / 1000;
    if (timeDiff < 60) return '방금 전';
    else if (timeDiff < 60 * 60 * 24 * 3) return formatDistanceToNow(d, { addSuffix: true, locale: ko });
    // now와 feedDate 차이 : 방금 전 / 3일 미만 시 몇 분~시간 전 / 3일 전 / 전체 날짜
    return format(d, 'PPP', { locale: ko });
  };

  const feeds = props.feedData || props.initialFeedData;

  return (
    <section>
      <div className="p-10 to-red-500">
        {feeds.map((feed, index) => (
          <React.Fragment key={index}>
            <div className="p-4 border-2 my-10 relative rounded-md shadow-md">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full border-2">
                    <img src="" alt={feed.image} />
                  </div>
                  <div className="ml-2 cursor-default">{feed.nickname}</div>
                </div>
                <div className="mx-2 text-sm cursor-default">{dateDistance(feed.date)}</div>
              </div>
              <div className="mt-2 cursor-default">
                {feed.nickname}님이 {feed.content} 공부를 {feed.type}
              </div>
              <div className="w-10 h-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={1.1}
                  stroke="currentColor"
                  className={`w-6 h-6 absolute right-6 bottom-5 hover:animate-beat ${feed.isLike ? 'fill-red-500' : ''} cursor-pointer`}
                  onClick={() => props.handleLike(index)}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default FeedContent;

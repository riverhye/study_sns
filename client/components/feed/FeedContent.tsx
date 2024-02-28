import FeedItem from './FeedItem';
import { FeedContentProps } from '@/type/type';
import LikeButton from './LikeButton';
import { useEffect } from 'react';
import NoFeed from './NoFeed';

const FeedContent: React.FC<FeedContentProps> = props => {
  const feeds = props.feedData;

  return (
    <section>
      <div className="py-5 px-20 to-red-500">
        {feeds ? (
          feeds.map((feed, index) => (
            <FeedItem key={feed.feedId} feed={feed} index={index} handleLike={props.handleLike}>
              {/* LikeFeed를 FeedItem 내에서 렌더링 */}
              <div className="w-10 h-10">
                {/* 알림, 시작 -> false */}
                {/* 끝 -> true */}
                {!props.type && <LikeButton isLike={feed.isLike || false} onClick={() => props?.handleLike?.(index)} />}
              </div>
            </FeedItem>
          ))
        ) : (
          <NoFeed />
        )}
      </div>
    </section>
  );
};

export default FeedContent;

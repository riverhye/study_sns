import FeedItem from './FeedItem';
import { FeedContentProps } from '@/type/type';
import LikeButton from './LikeButton';
import NoFeed from './NoFeed';
import { useEffect } from 'react';

const FeedContent: React.FC<FeedContentProps> = props => {
  const feeds = props.feedData;

  useEffect(() => {
    console.log(feeds);
  }, []);

  return (
    <section>
      <div className="py-5 px-20 to-red-500">
        {feeds?.length !== 0 ? (
          feeds?.map((feed, index) => (
            <FeedItem key={feed.feedId} feed={feed} index={index} handleLike={props.handleLike}>
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

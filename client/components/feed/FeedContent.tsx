import FeedItem from './FeedItem';
import { FeedContentProps } from '@/type/type';
import LikeButton from './LikeButton';

const FeedContent: React.FC<FeedContentProps> = props => {
  const feeds = props.feedData || props.initialFeedData;

  return (
    <section>
      <div className="py-5 px-20 to-red-500">
        {feeds.map((feed, index) => (
          <FeedItem key={index} feed={feed} index={index} handleLike={props.handleLike}>
            {/* LikeFeed를 FeedItem 내에서 렌더링 */}
            <div className="w-10 h-10">
              {!props.type && <LikeButton isLike={feed.isLike || false} onClick={() => props?.handleLike?.(index)} />}
            </div>
          </FeedItem>
        ))}
      </div>
    </section>
  );
};

export default FeedContent;

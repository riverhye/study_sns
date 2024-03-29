import React, { ReactNode } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FeedItemProps } from '@/type/type';

const FeedItem: React.FC<FeedItemProps> = ({ feed, children }) => {
  const dateDistance = (date: string): ReactNode => {
    const now = Date.now();
    const d = new Date(date);
    const timeDiff = (now - d.getTime()) / 1000;
    if (timeDiff < 60) return '방금 전';
    else if (timeDiff < 60 * 60 * 24 * 3) return formatDistanceToNow(d, { addSuffix: true, locale: ko });
    return format(d, 'PPP', { locale: ko });
  };

  return (
    <React.Fragment>
      <div className="p-4 border-2 my-10 relative rounded-md shadow-md h-36">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full border-2 overflow-hidden">
              <img src={feed.profileImage || '/blank-profile.png'} alt="profile" width={300} height={300} />
            </div>
            <div className="ml-2 cursor-default">{feed.nickname}</div>
          </div>
          <div className="mx-2 text-sm cursor-default">{dateDistance(feed.date)}</div>
        </div>
        <div className="pt-4 cursor-default">{feed.message}</div>
        {children}
      </div>
    </React.Fragment>
  );
};

export default FeedItem;

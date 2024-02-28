import React, { ReactNode, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { FeedItemProps, UserFeedData } from '@/type/type';
import { useWebSocket } from '../providers/SocketContext';
import { IMessageEvent } from 'websocket';

const FeedItem: React.FC<FeedItemProps> = ({ feed, children }) => {
  const { socket } = useWebSocket();
  const dateDistance = (date: string): ReactNode => {
    const now = Date.now();
    const d = new Date(date);
    const timeDiff = (now - d.getTime()) / 1000;
    if (timeDiff < 60) return '방금 전';
    else if (timeDiff < 60 * 60 * 24 * 3) return formatDistanceToNow(d, { addSuffix: true, locale: ko });
    return format(d, 'PPP', { locale: ko });
  };

  // if (socket) {
  //   try {
  //     socket.onmessage = evt => {
  //       try {
  //         console.log('걍 DATA', evt.data);
  //         const data = evt.data as string;
  //         const parsedData = JSON.parse(data);
  //         // play, pause, stop
  //         if (parsedData) {
  //           // setFeedData()
  //           console.log('parsed: ', parsedData);
  //         }

  //         // pause
  //         if(data.includes('휴식')) {
  //           setFeedData({
  //             message: data,
  //             date: '2024-02-02',
  //             feedId: 0,
  //             nickname: data.slice(0,13),
  //             profileImage: null
  //           });
  //         }
  //         // const parsedData = JSON.parse(evt);

  //         // if (parsedData.type === 'play') {
  //         //   console.log('play data: ', JSON.parse(parsedData.message));
  //         // } else if (parsedData.type === 'pause') {
  //         //   console.log('pause data: ', JSON.parse(parsedData.message));
  //         // } else if (parsedData.type === 'stop') {
  //         //   console.log('stop data: ', JSON.parse(parsedData.message));
  //         // } else {
  //         //   console.warn('Unknown message type:', parsedData.type);
  //         // }
  //       } catch (jsonError) {
  //         console.error('Error parsing JSON:', jsonError);
  //       }
  //     };
  //   } catch (error) {
  //     console.error('start socket', error);
  //   }
  // }

  return (
    <React.Fragment>
      <div className="p-4 border-2 my-10 relative rounded-md shadow-md h-36">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full border-2 overflow-hidden">
              <Image
                src={feed.profileImage ? `/${feed.profileImage}` : '/blank-profile.png'}
                alt="profile"
                priority={false}
                width={300}
                height={300}
              />
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

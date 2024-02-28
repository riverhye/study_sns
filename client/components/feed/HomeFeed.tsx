'use client';

import axios from 'axios';
import { UserFeedData, TimerState, SocketMessage } from '@/type/type';
import { useEffect, useRef, useState } from 'react';
import UpdateFeed from './UpdateFeed';
import FeedContent from './FeedContent';
import useTimerFunc from '../hooks/useTimerFunc';
import NoFeed from './NoFeed';
import { StateValue } from '@/type/type';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../providers/SocketContext';
import { IMessageEvent } from 'websocket';

const HomeFeed = () => {
  const [value, setValue] = useState<StateValue>({ content: '', error: '' });
  const [valid, setValid] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);
  const initialFeedData: UserFeedData[] = [
    {
      action: 'play',
      message: 'ㅇㅇ님이 운동 공부를 시작했습니다.',
      date: String(new Date()),
      feedId: 62,
      nickname: '테스트',
      profileImage: null,
      isLike: true,
    },
    {
      action: 'stop',
      message: '도레미님이 어떤 공부를 끝냈습니다.',
      feedId: 65,
      nickname: '어쩌고',
      profileImage: null,
      date: '2024-02-25',
      isLike: true,
    },
  ];
  const [feedData, setFeedData] = useState<UserFeedData[]>(initialFeedData);
  const { startStudy, pauseStudy, endStudy } = useTimerFunc();
  const { socket } = useWebSocket();
  const [type, setType] = useState<string>('');

  // 접속 시 팔로워들의 공부 시작/끝, 나를 새 팔로우, 나를 좋아요 한 가져오기
  useEffect(() => {
    if (socket) {
      try {
        socket.onmessage = (evt: IMessageEvent) => {};
      } catch (error) {
        console.error('start socket', error);
      }
    }

    // Temp: 아마 삭제할 axios
    // const getData = async () => {
    //   try {
    //     const res = await axios.get<UserFeedData[]>(`${process.env.NEXT_PUBLIC_URL}/feed`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     setFeedData(res.data);
    //   } catch (err) {
    //     console.error('피드 데이터', err);
    //   }
    // };

    // getData();
  }, []);

  // 피드 새로고침
  // const handleUpdateFeed = async () => {
  //   //   try {
  //   //     // Add: userId
  //   //     const res = await axios.get<UserFeedData[]>(`${process.env.NEXT_PUBLIC_URL}/getfeed/userId`, {
  //   //       headers: { Authorization: `Bearer ${token}` },
  //   //     });
  //   //     // 내림차순 정렬
  //   //     const sortedFeedData = res.data.slice().sort((a, b) => {
  //   //       return b.date.getTime() - a.date.getTime();
  //   //     });
  //   //     setFeedData(sortedFeedData);
  //   //   } catch (error) {
  //   //     console.error('새 피드', error);
  //   //   }
  // };

  // [알림] 피드 좋아요
  let feedId: number = 0; // 해당 피드만

  const handleLike = async (index: number) => {
    try {
      const updatedFeedData = [...feedData];
      updatedFeedData[index].isLike = !updatedFeedData[index].isLike;
      setFeedData(updatedFeedData);

      const newFeedId = updatedFeedData[index].feedId;

      if (socket && newFeedId !== undefined) {
        try {
          // 좋아요 추가
          if (feedId !== undefined) {
            if (feedData[index].isLike !== updatedFeedData[index].isLike) {
              const message: SocketMessage = { action: 'like', feedId };
              console.log(message);
              socket.send(message);
            }
          }

          // 내 피드인 경우에만 feedData에 넣기 + 알림 아이콘 추가
          // 내 피드 : nickname과 비교
          socket.onmessage = (evt: IMessageEvent) => {
            console.log(JSON.parse(evt.data as string));

            // if(nickname === 받아온닉네임) {
            // setFeedData(evt.data); // feedData에 넣기
            // }
          };
        } catch (error) {
          console.error('start socket', error);
        }
      }

      // const res = await axios.post(
      //   `${process.env.NEXT_PUBLIC_URL}/like/addlike`,
      //   {
      //     feedId: feedData[index].feedId,
      //     userId,
      //     isLike: updatedFeedData[index].isLike,
      //   },
      //   { headers: { Authorization: `Bearer ${token}` } },
      // );
      console.log('피드 좋아요 전송');
    } catch (error) {
      console.error('피드 좋아요', error);
    }
  };

  // 빈값 아닐 때에만 타이머 시작 (1) 엔터키
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 키의 기본 동작인 줄바꿈을 막음
      if (value.content.trim() !== '') {
        handleContent();
      } else {
        setValue({ ...value, error: '공부할 내용을 먼저 입력해 주세요.' });
        inputRef.current!.focus();
      }
    }
  };

  // 빈값 아닐 때에만 타이머 시작 (2) 클릭
  const handleContent = () => {
    if (value.content.trim() !== '') {
      startStudy(value.content);
      setValue({ content: '', error: '' });
    } else {
      setValue({ ...value, error: '공부할 내용을 먼저 입력해 주세요.' });
      inputRef.current!.focus();
    }
  };

  useEffect(() => {
    if (studyStatus === 'start' || studyStatus === 'pause') setValid(true);
    else setValid(false);
  }, [studyStatus]);

  // 공부 시작/끝 피드 보여주기
  if (socket) {
    try {
      socket.onmessage = evt => {
        try {
          const data = evt.data as string;
          const parsedData = JSON.parse(data);
          const parsedType = parsedData?.type;

          if (parsedType === 'play' || parsedType === 'stop') {
            // setType(parsedType);
            const newFeedData: UserFeedData = {
              action: parsedType,
              message: parsedData.message?.pausePlay || parsedData.message.stopPlay || parsedData.message.message,
              nickname: parsedData.message.nickname,
              profileImage: parsedData.message.nickname,
              date: parsedData.message.date,
            };
            setFeedData(prevData => [...prevData, newFeedData]);
          }
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      };
    } catch (error) {
      console.error('socket', error);
    }
  }

  return (
    <>
      <section>
        <div className="flex justify-center h-12 w-full mt-10">
          {!valid && (
            <>
              <input
                onChange={e => setValue({ content: e.target.value, error: '' })}
                value={value.content}
                onKeyDown={handleEnter}
                placeholder="무엇을 공부할까요?"
                ref={inputRef}
                className="w-1/4 outline-none indent-3 focus:outline-none placeholder:text-zinc-500 focus:bg-subtle-blue rounded-md transition-all"
                disabled={valid}
              />
              <button
                onClick={handleContent}
                type="button"
                disabled={valid}
                className={`w-20 ml-3 rounded-md ${valid ? 'bg-slate-200' : 'bg-strong-yellow'} active:filter-none shadow-md transform active:scale-75 transition-transform`}>
                START
              </button>
            </>
          )}
        </div>
        <div role="alert" className="text-red-400 text-xs mt-4 flex justify-center h-10">
          {value.error}
        </div>

        {feedData ? (
          <>
            {/* <UpdateFeed handleUpdateFeed={handleUpdateFeed} /> */}
            <FeedContent initialFeedData={initialFeedData} feedData={feedData} handleLike={handleLike} />
          </>
        ) : (
          <div className="mt-32">
            <NoFeed />
          </div>
        )}
      </section>
    </>
  );
};

export default HomeFeed;

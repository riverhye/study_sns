'use client';

import { UserFeedData, TimerState, SocketMessage } from '@/type/type';
import { useEffect, useRef, useState } from 'react';
import FeedContent from './FeedContent';
import useTimerFunc from '../hooks/useTimerFunc';
import { StateValue } from '@/type/type';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../providers/SocketContext';

const HomeFeed = () => {
  const [value, setValue] = useState<StateValue>({ content: '', error: '' });
  const [valid, setValid] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);
  const initialFeedData: UserFeedData[] = [];
  const [feedData, setFeedData] = useState<UserFeedData[]>(initialFeedData);
  const { startStudy } = useTimerFunc();
  const { socket } = useWebSocket();

  // 접속 시 팔로워들의 공부 시작/끝, 나를 새 팔로우, 나를 좋아요 한 가져오기
  useEffect(() => {
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

  // [알림] 피드 좋아요
  let previousLikeStatus: boolean | undefined = undefined;

  const handleLike = async (index: number) => {
    try {
      const updatedFeedData = [...feedData];
      updatedFeedData[index].isLike = !updatedFeedData[index].isLike;

      const newFeedId = updatedFeedData[index].feedId;

      if (socket && newFeedId !== undefined) {
        try {
          // 좋아요 추가 또는 취소
          const isLikeAction = feedData[index].isLike !== updatedFeedData[index].isLike;
          if (isLikeAction) {
            const actionType = updatedFeedData[index].isLike ? 'like' : 'unlike';
            console.log(actionType);

            const message: SocketMessage = { action: actionType, feedId: newFeedId };
            console.log(message);
            socket.send(message);

            // 서버에 전송 후 현재 상태를 이전 상태로 업데이트
            previousLikeStatus = updatedFeedData[index].isLike;
          }
        } catch (error) {
          console.error('start socket', error);
        }
      }

      // setFeedData를 호출하기 전에 좋아요 상태를 업데이트
      previousLikeStatus = feedData[index].isLike;
      setFeedData(updatedFeedData);

      // 좋아요 상태가 변경된 경우에만 서버로 전송
      if (previousLikeStatus !== undefined && previousLikeStatus !== updatedFeedData[index].isLike) {
        // 서버에 좋아요 추가 또는 취소 요청
      }

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
          console.log(evt.data);
          const data = evt.data as string;
          const parsedData = JSON.parse(data);
          console.log(parsedData);
          const parsedType = parsedData?.type;

          if (parsedType === 'play' || parsedType === 'stop') {
            const newFeedData: UserFeedData = {
              action: parsedType,
              message: parsedData.message?.pausePlay || parsedData.message.stopPlay || parsedData.message.message,
              nickname: parsedData.message.nickname,
              profileImage: process.env.NEXT_PUBLIC_USER_IMG_URL + parsedData.message.nickname,
              date: parsedData.message.date,
            };
            setFeedData(prevData => [newFeedData, ...prevData]);
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
        <FeedContent feedData={feedData} handleLike={handleLike} />
      </section>
    </>
  );
};

export default HomeFeed;

'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Category from './Category';
import Timer from './Timer';
import TodoHeader from './TodoHeader';

export interface HeaderLeftData {
  content: string[];
  // timer fields
}

const HeaderLeft = () => {
  const [todoList, setTodos] = useState<HeaderLeftData['content']>([
    '오늘의 할일1111',
    '할일b',
    '할일c',
    '할일ㄹㄹㄹㄹd',
  ]);

  // todo 바뀔 때마다 반영
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const getData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}`, {
          params: { formattedDate },
        });
        setTodos(res.data);
      } catch (err) {
        console.error('투두 header 데이터 로드 실패(미연결)', err);
      }
    };

    // getData();
  }, [todoList]);

  return (
    <>
      <div className="flex flex-col h-auto w-2/12 px-4 bg-main-blue p-0">
        <Category />
        <TodoHeader content={todoList} />
        <Timer />
      </div>
    </>
  );
};

export default HeaderLeft;

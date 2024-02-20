//리덕스 값이 변할때마다 api요청
import React, { useEffect, useState } from 'react';
//리덕스
import { setReduxDate } from '@/store/module/date';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { timeStamp } from './timeStamp';
import axios from 'axios';
//리스트를 만들어서 todo값 담기->map으로 돌려서 표현, 다른날자 누르면 리스트를 대체=>map으로 돌려서 바꿔지는 todo리스트
//그 리스트를 의존성배열에 걸어두면 될듯(리스트도 타입이 필요하겠네..)

interface StudyTodoProps {
  todoData?: {
    todoDate: string;
    todoContent: string;
  }[];
  todoDate?: string;
  nickname: string;
}
const StudyTodo = (props: StudyTodoProps) => {
  // 리덕스
  const dispatch = useAppDispatch();
  const reduxdate = useAppSelector(state => state.date.date);
  const [date, setDate] = useState(''); //날짜
  const [todoText, setTodoText] = useState(''); //날짜

  //
  const data = props.todoData;
  const nickname = props.nickname;
  useEffect(() => {
    setDate(timeStamp());
    dispatch(setReduxDate(timeStamp()));
    //페이지 렌더할때마다 현재시간으로
  }, []);
  useEffect(() => {
    //달력에 있는 값 누를때 일어나는 일
    setDate(reduxdate);
    getTodo();
  }, [reduxdate]);

  //todo 생성
  async function todoController() {
    const todoContent = todoText;
    const todoDate = date;
    const userId = 123; //!일단 임의 나중에 토큰값으로 교체 예정
    const data = {
      todoContent: todoContent,
      todoDate: todoDate,
      userId: userId,
    };
    console.log(data);
    setTodoText('');
    try {
      //리덕스에 담긴 날짜 값 가져오고 input값 가져와서 axios요청 보내기
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/study/maketodo`, data);
    } catch (error) {
      console.error('Todo 생성 요청이 실패했습니다.', error);
    }
  }

  //todo 가져오기
  async function getTodo() {
    //리덕스에 담긴값을 보내서 todor가져오기
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/study/gettodo/${nickname}/${date}`);
      //!리스트에 담기
    } catch (error) {
      console.error('Todo데이터 가져오기에 실패 했습니다.', error);
    }
  }
  return (
    <>
      <div>날짜:{date}</div>
      <input
        type="text"
        value={todoText}
        onChange={e => {
          setTodoText(e.target.value);
        }}
      />
      <button onClick={todoController}>생성</button>
    </>
  );
};

export default StudyTodo;

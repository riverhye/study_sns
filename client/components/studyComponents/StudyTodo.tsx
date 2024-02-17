//리덕스 값이 변할때마다 api요청
import React, { useEffect, useState } from 'react';
//리덕스
import { setReduxDate } from '@/store/module/date';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { timeStamp } from './timeStamp';
import axios from 'axios';
interface StudyTodoProps {
  todoData?: {
    todoDate: string;
    todoContent: string;
  }[];
  todoDate?: string;
}
const StudyTodo = (props: StudyTodoProps) => {
  // 리덕스

  const reduxdate = useAppSelector(state => state.date.date);
  const [date, setDate] = useState(''); //날짜
  const [todoText, setTodoText] = useState(''); //날짜

  //
  const data = props.todoData;
  useEffect(() => {
    setDate(timeStamp());
  }, []);
  useEffect(() => {
    //달력에 있는 값 누를때 일어나는 일
    setDate(reduxdate);
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
      axios.post(`${process.env.NEXT_PUBLIC_URL}/study/maketodo`, data);
    } catch (error) {
      console.error('Todo 생성 요청이 실패했습니다.', error);
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

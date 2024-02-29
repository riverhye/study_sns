//리덕스 값이 변할때마다 api요청
import React, { useEffect, useMemo, useState, useRef } from 'react';
//리덕스
import { setReduxDate } from '@/store/module/date';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { timeStamp } from './timeStamp';
import axios from 'axios';
import '../../styles/todoStyle.css';
//아이콘
import { Icon } from '@iconify/react/dist/iconify.js';
import { setReduxTrigger } from '@/store/module/trigger';
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
interface TodoItem {
  todoId?: number;
  userId?: number;
  todoContent: string;
  todoDate?: string;
  nickname?: string;
}
const StudyTodo = (props: StudyTodoProps) => {
  // 리덕스
  const dispatch = useAppDispatch();
  const reduxdate = useAppSelector(state => state.date.date);
  const [todoText, setTodoText] = useState(''); //날짜
  const [todoList, setTodoList] = useState<TodoItem[]>([]); //todo 리스트
  //ref정의

  //todoList배열 추가
  function addTOdoList(newTodo: TodoItem) {
    const todoCopy = [...todoList];
    todoCopy.push(newTodo);
    setTodoList(todoCopy);
  }
  const myNickname = localStorage.getItem('nickname');
  const token = localStorage.getItem('accessToken'); //토큰가져와서 변수에 저장하는 코드
  const data = props.todoData;
  const nickname = props.nickname;
  //애니메이션 관련 코드
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    dispatch(setReduxDate(timeStamp()));
    console.log(myNickname, nickname);
    //페이지 렌더할때마다 현재시간으로
  }, []);
  useEffect(() => {
    //달력에 있는 값 누를때 일어나는 일
    getTodo();
  }, [reduxdate]);

  // useEffect(() => {
  //   SetTodomap();
  // }, [todoList]);

  const SetTodomap: JSX.Element = useMemo(() => {
    return (
      <>
        {todoList.map((todo, todoId) => (
          <div className="group">
            <div className=" rounded-md transition-all border-[1.5px] border-gray-200 w-[350px] h-[80px] my-2 flex items-center mr-3 justify-between  group-hover:outline outline-rose-200">
              <div key={todoId} className="ml-3">
                {todo.todoContent}
              </div>
              <button
                className={`mr-3 text-rose-300 ml-auto ${myNickname === decodeURIComponent(nickname) ? 'hidden group-hover:block' : 'hidden'} `}
                onClick={() => deleteIcon(todo.todoId)}>
                <Icon icon="zondicons:minus-outline" />
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }, [todoList]);

  //호버시에 삭제 뜨는 함수
  async function deleteIcon(todoId: number | undefined) {
    //유저가 일치 한다면
    if (myNickname === decodeURIComponent(nickname)) {
      //호버했을때 보여진다음 삭제 axios요청
      //pop해서 새로운 배열 등록
      //!어떻게 요소를 분간할 것인가?
      console.log('요청들어감', todoId);
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_URL}/study/deletetodo/${todoId}`, {
          data: { todoId: todoId },
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('todo삭제 실패', error);
      }

      //!axios를 다시 요청해서 배열을 바꿀것인가?
      console.log('삭제 버튼 클릭');
    }
  }

  const trigger = useAppSelector(state => state.trigger.trigger);

  //todo 생성
  async function todoController() {
    if (todoList.length >= 6) {
      //input주변이 빨개지면서 흔들거리기
      const inputElement = inputRef.current;
      const inputElementT = buttonRef.current;
      if (inputElement && inputElementT) {
        inputElement.classList?.add('vibration');
        inputElement.classList?.add('red-outline');
        inputElementT.classList?.add('vibration');

        setTimeout(() => {
          inputElement.classList?.remove('vibration');
          inputElement.classList?.remove('red-outline');
          inputElementT.classList?.remove('vibration');
        }, 400);
      }

      return;
      // 6개 이상이면 함수 종료
    }
    const todoContent = todoText;
    const todoDate = reduxdate;

    const data = {
      todoContent: todoContent,
      todoDate: todoDate,
    };
    // console.log(data);
    setTodoText('');

    //빈값(띄어쓰기만 있을경우도 포함)을 작성시 함수 종료
    const trimmed = todoContent.trim();
    if (trimmed === '') {
      return;
    }
    try {
      //리덕스에 담긴 날짜 값 가져오고 input값 가져와서 axios요청 보내기
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/study/maketodo`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addTOdoList({ todoContent: todoContent });
      dispatch(setReduxTrigger(!trigger));
    } catch (error) {
      console.error('Todo 생성 요청이 실패했습니다.', error);
    }
  }

  //todo 가져오기
  async function getTodo() {
    //리덕스에 담긴값을 보내서 todor가져오기
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/study/gettodo/${nickname}/${reduxdate}`);
      setTodoList(res.data);
      console.log(res.data);
      const trigger = useAppSelector(state => state.trigger.trigger);
      // dispatch(setReduxTrigger(!trigger));
    } catch (error) {
      console.error('Todo데이터 가져오기에 실패 했습니다.', error);
    }
  }
  return (
    <>
      {myNickname === decodeURIComponent(nickname) && (
        <div>
          <input
            ref={inputRef}
            type="text"
            value={todoText}
            onChange={e => {
              setTodoText(e.target.value);
            }}
            className="outline-none indent-3 focus:outline-none placeholder:text-zinc-500 focus:bg-subtle-blue rounded-md transition-all border-[1.5px] border-subtle-blue shadow w-[350px] h-[38px]"
            placeholder="TODO 내용을 입력 해주세요"
          />
          <button
            ref={buttonRef}
            onClick={todoController}
            className="w-20 h-[40px] ml-3 rounded-md bg-strong-yellow active:filter-none shadow-md transform active:scale-75 transition-transform">
            작성
          </button>
        </div>
      )}

      <div className="my-3">{reduxdate}</div>
      <div className="flex flex-col flex-wrap h-[200px]  content-start">{SetTodomap}</div>
    </>
  );
};

export default StudyTodo;

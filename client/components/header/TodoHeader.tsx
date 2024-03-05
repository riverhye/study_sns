import axios from 'axios';
import { useEffect, useState } from 'react';
import { timeStamp } from '../studyComponents/timeStamp';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { setReduxTrigger } from '@/store/module/trigger';

export interface TodoContent {
  todoId: number;
  todoContent: string;
  todoDate: string;
  nickname: string;
  userId: number;
}
[];

const TodoHeader = () => {
  const initialTodo: TodoContent[] = [
    {
      todoId: 0,
      todoContent: '등록된 할 일이 없어요.',
      todoDate: '',
      nickname: '',
      userId: 0,
    },
  ];
  const [prevTodo, setPrevTodo] = useState<TodoContent[]>(initialTodo);
  const nickname = localStorage.getItem('nickname');
  const trigger = useAppSelector(state => state.trigger.trigger);
  const token = useAppSelector(state => state.sign.token);
  const dispatch = useDispatch();

  // 로그인 했을 때 가져오기
  useEffect(() => {
    const getTodo = async () => {
      try {
        const date = timeStamp();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/study/gettodo/${nickname}/${date}`);
        if (!compareArrays(res.data, prevTodo)) {
          setPrevTodo(res.data);
        }
        // dispatch(setReduxTrigger(!trigger));
      } catch (error) {
        console.error('Todo데이터 가져오기에 실패 했습니다.', error);
      }
    };

    getTodo();

    if (!token) {
      setPrevTodo(initialTodo);
    }
  }, [token]);

  // post, delete 할 때마다 가져오기
  useEffect(() => {
    const getTodo = async () => {
      try {
        const date = timeStamp();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/study/gettodo/${nickname}/${date}`);
        if (!compareArrays(res.data, prevTodo)) {
          dispatch(setReduxTrigger(!trigger));
        }

        setPrevTodo(res.data);
      } catch (error) {
        console.error('Todo 데이터: ', error);
      }
    };

    getTodo();
  }, [trigger]);

  // Todo 배열 비교
  const compareArrays = (arr1: TodoContent[], arr2: TodoContent[]): boolean => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  return (
    <>
      <div className="border-2 p-1 rounded-md w-48 min-h-56 h-auto my-10 bg-gray-100 m-auto">
        <h2 className=" text-center bg-subtle-blue py-1 rounded-md mb-3 cursor-default">TO DO</h2>
        <ul>
          {prevTodo.map(todo => (
            <li key={todo?.todoId} className="text-sm my-1 flex items-center cursor-default">
              <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 256 256">
                <g fill="#7EC7D9">
                  <path d="M152 128a24 24 0 1 1-24-24a24 24 0 0 1 24 24" fill="cyan" opacity={0.3}></path>
                  <path d="M128 96a32 32 0 1 0 32 32a32 32 0 0 0-32-32m0 48a16 16 0 1 1 16-16a16 16 0 0 1-16 16"></path>
                </g>
              </svg>
              <span>{todo.todoContent}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoHeader;

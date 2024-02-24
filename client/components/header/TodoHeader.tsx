import { TodoHeaderProps } from '@/type/type';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { timeStamp } from '../studyComponents/timeStamp';

const TodoHeader = () => {
  // const todoList = props.content || '';
  const [todoList, setTodoList] = useState([]);
  const nickname = localStorage.getItem('nickname');

  useEffect(() => {
    getTodo();
  }, [todoList]);

  async function getTodo() {
    try {
      const date = timeStamp();
      // nickname, todoContent, todoDate, todoId
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/study/gettodo/${nickname}/${date}`);
      setTodoList(res.data);
    } catch (error) {
      console.error('Todo데이터 가져오기에 실패 했습니다.', error);
    }
  }

  return (
    <>
      <div className="border-2 p-1 rounded-md w-48 min-h-56 h-auto my-10 bg-gray-100 m-auto">
        <h2 className=" text-center bg-subtle-blue py-1 rounded-md mb-3 cursor-default">TO DO</h2>
        <ul>
          {todoList.map((todo, todoIdx) => (
            <li key={todoIdx + 1} className="text-sm my-1 flex items-center cursor-default">
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

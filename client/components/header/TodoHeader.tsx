export interface TodoHeaderProps {
  content: string[];
}

const TodoHeader = (props: TodoHeaderProps) => {
  const todoList = props.content || '';
  return (
    <>
      <div className="border-2 p-3 rounded-md w-52 h-56 my-10 md:w-40 bg-gray-100">
        <ul>
          {todoList.map((todo, index) => (
            <li key={index} className="text-sm my-1">
              {todo}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoHeader;

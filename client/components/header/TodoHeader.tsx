const TodoHeader = () => {
  const dummies = ['할일1111', '할일b', '할일c', '할일ㄹㄹㄹㄹd'];
  return (
    <>
      <div className="border-2 p-3 rounded-md h-56">
        <ul>
          {dummies.map((dum, index) => (
            <li key={index}>{dum}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoHeader;

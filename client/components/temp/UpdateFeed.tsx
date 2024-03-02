export interface UpdateFeedProps {
  handleUpdateFeed: () => Promise<void>;
}

const UpdateFeed: React.FC<UpdateFeedProps> = ({ handleUpdateFeed }) => {
  return (
    <>
      <div className="flex items-center justify-center mt-5 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gray"
          className="w-6 h-6 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
        <div className="w-2 h-6 cursor-pointer"></div>
        <span onClick={handleUpdateFeed} className="text-gray-500 mt-2 cursor-pointer">
          피드 보기
        </span>
      </div>
    </>
  );
};

export default UpdateFeed;

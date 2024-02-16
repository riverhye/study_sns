export interface UpdateFeedProps {
  handleUpdateFeed: () => Promise<void>;
}

const UpdateFeed: React.FC<UpdateFeedProps> = ({ handleUpdateFeed }) => {
  return (
    <>
      <div onClick={handleUpdateFeed} className="flex items-center justify-center mt-5 w-full hover:cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
        피드 보기
      </div>
    </>
  );
};

export default UpdateFeed;

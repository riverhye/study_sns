import React from 'react';
import { LikeButtonProps } from '@/type/type';

const LikeButton: React.FC<LikeButtonProps> = ({ isLike, onClick }) => {
  return (
    <div className="w-10 h-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-8 h-8 absolute right-6 bottom-5 hover:animate-beat ${isLike ? 'fill-red-500' : 'fill-neutral-600'} cursor-pointer`}
        onClick={onClick}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </div>
  );
};
export default LikeButton;

interface IconProps {
  color: string;
}

function HomeIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24">
      <path
        fill={color} // this
        stroke="white"
        strokeWidth={1.3}
        d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z"></path>
    </svg>
  );
}

function SearchIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24">
      <path
        fill={color} // this
        stroke="white"
        strokeWidth={1.3}
        d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"></path>
    </svg>
  );
}

function StudyIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 512 512">
      <path
        fill={color} // this
        stroke="whitesmoke"
        strokeWidth={25}
        d="M256 160c16-63.16 76.43-95.41 208-96a15.94 15.94 0 0 1 16 16v288a16 16 0 0 1-16 16c-128 0-177.45 25.81-208 64c-30.37-38-80-64-208-64c-9.88 0-16-8.05-16-17.93V80a15.94 15.94 0 0 1 16-16c131.57.59 192 32.84 208 96m0 0v288"></path>
    </svg>
  );
}

function RankIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 640 512">
      <path
        fill={color} // this
        stroke="white"
        strokeWidth={28}
        d="M353.8 54.1L330.2 6.3c-3.9-8.3-16.1-8.6-20.4 0l-23.6 47.8l-52.3 7.5c-9.3 1.4-13.3 12.9-6.4 19.8l38 37l-9 52.1c-1.4 9.3 8.2 16.5 16.8 12.2l46.9-24.8l46.6 24.4c8.6 4.3 18.3-2.9 16.8-12.2l-9-52.1l38-36.6c6.8-6.8 2.9-18.3-6.4-19.8l-52.3-7.5zM256 256c-17.7 0-32 14.3-32 32v192c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32zM32 320c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32zm416 96v64c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32H480c-17.7 0-32 14.3-32 32"></path>
    </svg>
  );
}

function LikeIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 256 256">
      <path
        fill={color} // this
        stroke="white"
        strokeWidth={12}
        d="M240 94c0 70-103.79 126.66-108.21 129a8 8 0 0 1-7.58 0C119.79 220.66 16 164 16 94a62.07 62.07 0 0 1 62-62c20.65 0 38.73 8.88 50 23.89C139.27 40.88 157.35 32 178 32a62.07 62.07 0 0 1 62 62"></path>
    </svg>
  );
}

export default { HomeIcon, LikeIcon, RankIcon, SearchIcon, StudyIcon };

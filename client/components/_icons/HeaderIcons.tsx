import { TimerIconProps } from '@/type/type';

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
    <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
      <path
        fill={color}
        stroke="white"
        strokeWidth={1.1}
        d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3zm-9-2q-1.65 0-2.825-1.175T5 8q0-1.65 1.175-2.825T9 4q1.65 0 2.825 1.175T13 8q0 1.65-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20z"></path>
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

const Setting = ({ color }: { color: string }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024">
        <path
          fill={color}
          stroke="white"
          strokeWidth={100}
          d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8c-21.1 21.2-32.8 49.2-32.8 79.1c0 29.9 11.7 57.9 32.8 79.1c21.2 21.1 49.2 32.8 79.1 32.8c29.9 0 57.9-11.7 79.1-32.8c21.1-21.2 32.8-49.2 32.8-79.1c0-29.9-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8m412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.44 353.44 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.93 445.93 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57c0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.27 448.27 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35m-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8s175.8 78.7 175.8 175.8s-78.7 175.8-175.8 175.8"></path>
      </svg>
    </>
  );
};

function StartTextIcon() {
  <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
    <path
      fill="white"
      d="M2.185 6.758c-1.495 0-2.193.849-2.193 2.171v1.534c0 1.373.246 1.959 1.235 2.58l.763.474c.618.374.698.651.698 1.453v1.354c0 .393-.18.636-.521.636c-.342 0-.522-.228-.522-.636v-2.125H-.008v2.14c0 1.338.683 2.17 2.159 2.17c1.526 0 2.224-.882 2.224-2.17v-1.666c0-1.272-.326-1.927-1.265-2.529l-.763-.49c-.537-.342-.668-.586-.668-1.469v-1.24c0-.394.18-.637.503-.637c.341 0 .537.247.537.636v2.105h1.656V8.93c0-1.307-.698-2.17-2.19-2.17m2.711.162v1.635h1.17v9.797h1.687V8.555h1.17V6.92zm5.066 0l-.943 11.427h1.672l.23-3.053h1.227l.23 3.053h1.706l-.94-11.427Zm4.985 0v11.427h1.687v-4.78h1.024v3.917c0 .652.276.863.276.863h1.687c.004.004-.272-.207-.272-.863v-2.972c0-.949-.357-1.47-1.22-1.65v-.197c.86-.131 1.3-.768 1.3-1.797V8.929c0-1.257-.747-2.009-2.193-2.009zm5.02 0v1.635h1.169v9.797h1.687V8.555h1.17V6.92zm-8.529 1.55h.2l.399 5.274h-.997zm5.2.004h.437c.522 0 .667.212.667 1.06v1.419c0 .817-.18 1.06-.732 1.06h-.372z"></path>
  </svg>;
}

const StartIcon: React.FC<TimerIconProps> = ({ onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 14 14" onClick={onClick}>
      <path
        fill="white"
        fillRule="evenodd"
        d="M2.676.02a1.74 1.74 0 0 0-.845.218a1.64 1.64 0 0 0-.895 1.433v10.677a1.64 1.64 0 0 0 .895 1.433a1.74 1.74 0 0 0 1.718-.016l8.63-5.338a1.61 1.61 0 0 0-.001-2.876L3.548.253A1.74 1.74 0 0 0 2.676.02"
        clipRule="evenodd"></path>
    </svg>
  );
};

const PauseIcon: React.FC<TimerIconProps> = ({ onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 14 14" onClick={onClick}>
      <path
        fill="white"
        fillRule="evenodd"
        d="M0 1.5A1.5 1.5 0 0 1 1.5 0H4a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 4 14H1.5A1.5 1.5 0 0 1 0 12.5zM10 0a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 10 14h2.5a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 12.5 0z"
        clipRule="evenodd"></path>
    </svg>
  );
};

const StopIcon: React.FC<TimerIconProps> = ({ onClick }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 14 14" onClick={onClick}>
      <path
        fill="white"
        fillRule="evenodd"
        d="M1.5 0A1.5 1.5 0 0 0 0 1.5v11A1.5 1.5 0 0 0 1.5 14h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 12.5 0z"
        clipRule="evenodd"></path>
    </svg>
  );
};

export default {
  HomeIcon,
  LikeIcon,
  RankIcon,
  SearchIcon,
  Setting,
  StudyIcon,
  StartIcon,
  StartTextIcon,
  PauseIcon,
  StopIcon,
};

// import useTimerFunc from "../hooks/useTimerFunc";
// import { StateValue } from "./HomeFeed";

// const { startStudy, pauseStudy, endStudy } = useTimerFunc();

// interface StudyStartProps {
//     value: StateValue;
//     setValue: React.Dispatch<React.SetStateAction<StateValue>>;
//     handleContent: () => void;
//     handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
// }

// const StudyStart = (props:StudyStartProps) => {
//     const {value, setValue, handleContent, handleEnter} = props;

//     return <>
//             <div className="flex justify-center h-12 w-full mt-10">
//           <input
//             onChange={e => setValue({ ...value, content: e.target.value })}
//             onKeyDown={handleEnter}
//             placeholder="무엇을 공부할까요?"
//             className="w-1/3 outline-none rounded-md border-l-black indent-3 focus:outline-none placeholder:text-zinc-500"
//           />
//           <button
//             onClick={handleContent}
//             type="button"
//             className="w-20 rounded-full bg-[#BBE2EC] drop-shadow-md active:filter-none">
//             시작
//           </button>
//           <button onClick={pauseStudy}>(임시)일시정지</button>
//           <button onClick={() => endStudy(true)}>(임시)끝</button>
//         </div>
//         {value.error && (
//           <div role="alert" className="text-red-400 text-sm ml-48">
//             {value.error}
//           </div>
//         )}
//     </>
// }

// export default StudyStart;

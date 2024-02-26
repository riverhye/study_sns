/*
?달력
TODO 날짜를 누르면 일자가  redux에 저장 (todo와 calender가 다른 컴포넌트이기 때문에),
   todo페이지에선 redux에 저장된 값을 가져와서 todo axios요청시 넘기기
*/
'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { format, addMonths, subMonths, setDate } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse } from 'date-fns';
//리덕스 관련
import { formatDate } from './timeStamp';
import { setReduxDate } from '@/store/module/date';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// !redux에 버튼을 눌렀을때 달 정보 저장, 페이지 렌더때도 저장
const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  return (
    <div className="flex justify-between">
      {/* 여기가 년도,달 */}
      <div className=" w-11px  mx-2">
        <span className="text">
          <span className="text month">{format(currentMonth, 'M')}월</span>
          {format(currentMonth, 'yyyy')}
        </span>
      </div>
      {/* 여기가 이동 버튼 */}
      <div className="flex my-1">
        <div className="mx-2">
          <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
        </div>
        <div className="mx-2">
          <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
        </div>
      </div>
    </div>
  );
};

//여기가 주
//나중에 호버시에 날짜가 뜨게?
const RenderDays = () => {
  const date = ['Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

  return (
    <div className="flex ">
      {date.map((day, index) => (
        <div className="font-bold mx-2 w-10 h-8" key={index}>
          {day}
        </div>
      ))}
    </div>
  );
};

const RenderCells = ({ currentMonth, selectedDate, onDateClick }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = day;
      days.push(
        <div
          className={`col cell ${
            !isSameMonth(day, monthStart)
              ? 'disabled'
              : isSameDay(day, selectedDate)
                ? 'selected'
                : format(currentMonth, 'M') !== format(day, 'M')
                  ? 'not-valid'
                  : 'valid'
          } mx-2 w-10 h-8`}
          key={day}
          onClick={() => {
            // onDateClick(parse(cloneDay));
            onDateClick(cloneDay);
          }}>
          <span className={format(currentMonth, 'M') !== format(day, 'M') ? 'text not-valid' : ''}>
            {formattedDate}
          </span>
        </div>,
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className=" flex" key={day}>
        {days}
      </div>,
    );
    days = [];
  }
  return <div className="">{rows}</div>;
};

const Calender = () => {
  const dispatch = useAppDispatch();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const onDateClick = day => {
    setSelectedDate(day);
    dispatch(setReduxDate(formatDate(day))); //리덕스에 누른 날짜 담기
  };

  return (
    <>
      {' '}
      <div className="flex flex-col  w-[350px] h-[270px] border-[1px] rounded-md border-gray-500 my-2 ">
        <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
        <RenderDays />
        <RenderCells currentMonth={currentMonth} selectedDate={selectedDate} onDateClick={onDateClick} />
      </div>
    </>
  );
};
export default Calender;

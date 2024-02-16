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
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setReduxDate } from '@/store/module/date';

// !redux에 버튼을 눌렀을때 달 정보 저장, 페이지 렌더때도 저장
const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  return (
    <div className="header row flex fle">
      {/* 여기가 년도,달 */}
      <div className=" w-11px bg-slate-600">
        <span className="text">
          <span className="text month">{format(currentMonth, 'M')}월</span>
          {format(currentMonth, 'yyyy')}
        </span>
      </div>
      {/* 여기가 이동 버튼 */}
      <div className="col col-end">
        <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
        <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
      </div>
    </div>
  );
};

//여기가 일
//나중에 호버시에 날짜가 뜨게?
const RenderDays = () => {
  const days = [];
  const date = ['Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="col" key={i}>
        {date[i]}
      </div>,
    );
  }

  return <div className="days row flex">{days}</div>;
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
          }`}
          key={day}
          onClick={() => cloneDay && onDateClick(parse(cloneDay))}>
          <span className={format(currentMonth, 'M') !== format(day, 'M') ? 'text not-valid' : ''}>
            {formattedDate}
          </span>
        </div>,
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="row flex" key={day}>
        {days}
      </div>,
    );
    days = [];
  }
  return <div className="body">{rows}</div>;
};

const Calender = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [retest, setRetest] = useState('none');

  // 리덕스
  const dispatch = useDispatch();
  const reduxtest = useSelector(state => state.date);
  function testRedux() {
    dispatch(setReduxDate('hello'));
  }
  function testShow() {
    // setRetest(reduxtest);
    console.log('리덕스테스트', reduxtest);
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const onDateClick = day => {
    setSelectedDate(day);
  };
  return (
    <div className="calendar flex-col">
      <button onClick={testRedux}>리덕스에 hello올리기</button>
      <button onClick={testShow}>보여지기</button>
      <div>{retest}</div>
      <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
      <RenderDays />
      <RenderCells currentMonth={currentMonth} selectedDate={selectedDate} onDateClick={onDateClick} />
    </div>
  );
};
export default Calender;

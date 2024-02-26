import React from 'react';
import Calendar from '@/components/studyComponents/Calendar';
/*
!하나하나 연결 시킬지 (map으로),아니면 외부 달력쓸지 생각
*/

interface StudyTableProps {
  tableData?: { todayStudyTime: number; studyDate: string }[];
}

const StudyTable = (props: StudyTableProps) => {
  return (
    <>
      <hr />
      <Calendar />
    </>
  );
};

export default StudyTable;

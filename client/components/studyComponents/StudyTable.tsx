import React from 'react';
import Calender from '@/components/studyComponents/Calender';
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
      <Calender />
    </>
  );
};

export default StudyTable;

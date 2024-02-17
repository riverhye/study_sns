export function timeStamp() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 두 자리로 표현하기 위해 0으로 패딩
  const day = String(currentDate.getDate()).padStart(2, '0'); // 두 자리로 표현하기 위해 0으로 패딩

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate; // "yyyy-mm-dd" 형식의 현재 날짜 출력
}
//현재시간을 가져와서 2024-02-17이런 형식으로 변환시키는 함수

//db값 to 2024-02-17 변환 함수

//달력관련 변환 함수
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

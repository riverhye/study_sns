import React, { useEffect, useState } from 'react';

const SocketTest: React.FC = () => {
  // 서버에서는 해당 훅을 사용하지 않도록 변경
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // 클라이언트에서만 실행되는 코드
    if (typeof window !== 'undefined') {
      const websocket = new WebSocket('ws://127.0.0.1:8080/socket');
      setWs(websocket);

      websocket.onopen = function (event) {
        console.log('WebSocket Opened');
      };

      websocket.onmessage = function (event) {
        console.log('Message got: ' + event.data);
      };

      websocket.onclose = function (event) {
        console.log('WebSocket Closed.');
      };

      return () => {
        websocket.close();
      };
    }
  }, []);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return (
    <div>
      <h1>WebSocket 페이지</h1>
      <input type="text" value={message} onChange={handleMessageChange} />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default SocketTest;

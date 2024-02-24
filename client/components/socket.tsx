import { Client, Message } from '@stomp/stompjs';
import { useEffect } from 'react';
import { w3cwebsocket } from 'websocket';

const SocketCom = () => {
  const wsTest = () => {
    const token = localStorage.getItem('accessToken');
    console.log('token', token);

    const ws = new w3cwebsocket(`ws://localhost:8080/socket?token=${token}`);

    ws.onerror = function (e) {
      console.log('Connection Error', e);
    };

    ws.onopen = function () {
      console.log('W3C WebSocket Client Connected');
    };

    ws.onclose = function () {
      console.log('W3C WebSocket Client Disconnected');
    };
  };

  return (
    <>
      <button onClick={wsTest}>test</button>
    </>
  );
};

export default SocketCom;

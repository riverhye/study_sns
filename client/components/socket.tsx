import { Client, Message } from '@stomp/stompjs';
import { useEffect } from 'react';
// import WebSocket from 'ws';
// import { io } from 'socket.io-client';

import { w3cwebsocket } from 'websocket';

// const SocketCom = () => {
//   const stompTest = () => {
//     const token = localStorage.getItem('accessToken');
//     console.log(token);

//     const client = new Client({
//       brokerURL: `ws://localhost:8080/socket`,
//       reconnectDelay: 100000000,
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       debug: msg => {
//         console.log(msg);
//       },
//     });

//     client.activate();

//     // if (!client.connected) {
//     //   console.log('aaaaaaa');
//     //   try {
//     //     client.activate();
//     //   } catch (e) {
//     //     console.log('err socket', e);
//     //   }

//     //   client.onConnect = frame => {
//     //     console.log('WebSocket connected:', frame);

//     //     // 특정 토픽에 구독
//     //     client.subscribe('/topic/some-topic', (message: Message) => {
//     //       console.log('Received message:', message.body);
//     //     });

//     //     // 메시지 발행
//     //     client.publish({ destination: '/app/some-endpoint', body: 'Hello, WebSocket!' });
//     //   };

//     //   client.onStompError = frame => {
//     //     console.error('WebSocket error:', frame);
//     //   };

//     //   client.onWebSocketClose = closeEvent => {
//     //     console.log('WebSocket closed:', closeEvent);
//     //   };
//     // }
//   };

//   return (
//     <>
//       <button onClick={stompTest}>test</button>
//     </>
//   );
// };

// export default SocketCom;

// import { useState } from 'react';

const SocketCom = () => {
  const wsTest = () => {
    const token = localStorage.getItem('accessToken');
    console.log('token', token);

    const ws = new w3cwebsocket('ws://localhost:8080/socket', '', '', {
      Authorization: `Bearer ${token}`,
      // 'sec-websocket-version': '13',
    });

    // const token = localStorage.getItem('accessToken');
    // console.log('token', token);

    // const socket = io('ws://localhost:8080/socket', {
    //   extraHeaders: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // socketInstance.onopen = event => {
    //   console.log('WebSocket connected:', event);

    //   // 특정 토픽에 구독
    //   const subscribeMessage = {
    //     type: 'subscribe',
    //     destination: '/topic/some-topic',
    //   };
    //   socketInstance.send(JSON.stringify(subscribeMessage));

    //   // 메시지 발행
    //   const publishMessage = {
    //     type: 'publish',
    //     destination: '/app/some-endpoint',
    //     body: 'Hello, WebSocket!',
    //   };
    //   socketInstance.send(JSON.stringify(publishMessage));
    // };

    // socketInstance.onmessage = event => {
    //   console.log('Received message:', event.data);
    // };

    // socketInstance.onerror = error => {
    //   console.error('WebSocket error:', error);
    // };

    // socketInstance.onclose = event => {
    //   console.log('WebSocket closed:', event);
    // };
  };

  return (
    <>
      <button onClick={wsTest}>test</button>
    </>
  );
};

export default SocketCom;

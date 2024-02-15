import axios from 'axios';
import { useEffect, useState } from 'react';

const TestComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/test');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <div>{data ? <p>localhost:8080/test 에서 받아온 요청: {data}</p> : <p>Loading...</p>}</div>;
};

export default TestComponent;

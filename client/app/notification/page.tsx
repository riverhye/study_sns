import Notify from '@/components/notification/Notify';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification',
};

const FeedNotification = () => {
  return (
    <>
      <Notify />
    </>
  );
};

export default FeedNotification;

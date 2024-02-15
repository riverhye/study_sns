interface StudyUserProps {
  userData?: {
    nickname: string;
    email: string;
    folling: number;
    follower: number;
  };
}

const StudyUser = (props: StudyUserProps) => {
  return <div>studyUser</div>;
};

export default StudyUser;

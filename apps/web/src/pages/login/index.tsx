import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="m-auto mt-[10vh] flex w-full max-w-sm flex-col gap-6">
      <div className="card-brutal">
        <h1 className="title-brutal mb-6">正在跳转...</h1>
      </div>
    </div>
  );
};

export default LoginPage;
import { Outlet } from 'react-router-dom';

const SimpleLayout = () => {
  return (
    <div className="max-w-5xl mx-auto container px-4 py-6">
      <Outlet />
    </div>
  );
};

export default SimpleLayout;

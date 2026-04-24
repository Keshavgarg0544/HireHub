import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <main className="w-full">
      <Outlet />
    </main>
  );
};

export default MainLayout;

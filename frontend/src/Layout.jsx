import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <h1>Hello</h1>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;

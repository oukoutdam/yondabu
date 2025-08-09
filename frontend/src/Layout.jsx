import { Outlet } from "react-router";
import Header from "./Components/Header";

function Layout() {
  return (
    <>
      <Header title="よんだぶ" />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;

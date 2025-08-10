import { Outlet } from "react-router";
import Header from "./Components/Header";

function Layout() {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header title="よんだぶ" />
        <main style={{ flex: 1, minHeight: 0 }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;

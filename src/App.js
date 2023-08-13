import { Route, Routes, BrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDetail from "./pages/UserDetail";
import ListMember from "./pages/ListMember";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminStatistical from "./pages/AdminStatistical";
import AdminPosition from "./pages/AdminPosition";
import Leave from "./pages/Leave";
import AdminLeave from "./pages/AdminLeave";
import AdminLateMoney from "./pages/AdminLateMoney";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Homepage />} />
          <Route index path="/login" element={<Login />} />
          <Route index path="/register" element={<Register />} />
          <Route index path="/account" element={<UserDetail />} />
          <Route index path="/leave/:id" element={<Leave />} />
          <Route index path="/admin/leave" element={<AdminLeave />} />
          <Route index path="/late" element={<AdminLateMoney />} />
          <Route
            index
            path="/admin/account/:id"
            element={<AdminUserDetail />}
          />
          <Route
            index
            path="/admin/list-member/:position"
            element={<ListMember />}
          />
          <Route
            index
            path="/admin/statistical/:id"
            element={<AdminStatistical />}
          />
          <Route index path="/admin/position" element={<AdminPosition />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

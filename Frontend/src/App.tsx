import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminHome from "./admin/admin-home";
import StudentHome from "./user/student-home";
import Login from "./Authentication/login";
import SignUp from "./Authentication/signup";
import withAuthCheck from "./functions/checkAuth";
import NotFound from "./components/404";
import Preview from "./admin/Preview";
import ViewCertificate from "./user/view-certifcate";

const AppRoutes = () => {
  const ProtectedAdminHome = withAuthCheck(({ userRole }) => {
    if (userRole === "admin") return <AdminHome />;
    else {
      return <NotFound />;
    }
  });

  const ProtectedStudentHome = withAuthCheck(({ userRole }) => {
    if (userRole === "student") return <StudentHome />;
    else {
      return <NotFound />;
    }
  });

  const ProtectedPreview = withAuthCheck(({ userRole }) => {
    if (userRole === "admin") return <Preview />;
    else {
      return <NotFound />;
    }
  });

  return (
    <Routes>
      <Route path="/admin-home" element={<ProtectedAdminHome />} />
      <Route path="/preview" element={<ProtectedPreview />} />
      <Route path="/view/:certificateId" element={<ViewCertificate />} />
      <Route path="/student-home" element={<ProtectedStudentHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/" element={<SignUp />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="signup" element={<SignupPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="" element={<Home />}>
        <Route path=":userId" element={<MessagePage />} />
      </Route>
    </Route>
  )
);

export default router;

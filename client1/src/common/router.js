
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "../components/views/Landing/LandingPage";
import LoginPage from "../components/views/Users/LoginPage";
import RegisterPage from "../components/views/Users/RegisterPage";
import MyPage from "../components/views/Users/MyPage";
import ProfilePage from "../components/views/Users/ProfilePage";
import PasswordPage from "../components/views/Users/PasswordPage";
import BoardsListPage from "../components/views/Boards/ListPage";
import BoardsViewPage from "../components/views/Boards/ViewPage";
import BoardsEditPage from "../components/views/Boards/EditPage";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/users/login" element={<LoginPage />} />
                <Route path="/users/register" element={<RegisterPage />} />
                <Route path="/users/mypage" element={<MyPage />} />
                <Route path="/users/profile" element={<ProfilePage />} />
                <Route path="/users/password" element={<PasswordPage />} />
                <Route path="/boards/list/:boardType" element={<BoardsListPage />} />
                <Route path="/boards/view/:boardType/:boardId" element={<BoardsViewPage />} />
                <Route path="/boards/edit/:boardType" element={<BoardsEditPage />} />
                <Route path="/boards/edit/:boardType/:boardId" element={<BoardsEditPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;

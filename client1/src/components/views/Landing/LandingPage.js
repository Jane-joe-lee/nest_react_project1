import React from 'react'
import HeaderPage from "../../../components/views/Nav/HeaderPage";
import FooterPage from "../../../components/views/Nav/FooterPage";
//import { useNavigate } from "react-router-dom";

function LandingPage(props) {
   /* let navigate = useNavigate();

    const onClickLoginHandler = () => {
        navigate('/login');
    }
            <button onClick={onClickLoginHandler}>Login</button>
    */

    return (
        <div>
            <HeaderPage />
            <h2>시작 페이지</h2>
            <FooterPage />
        </div>
    );
}
export default LandingPage
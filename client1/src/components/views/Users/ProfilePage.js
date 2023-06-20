import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { profileImgUser, profileImgDeleteUser, getLoginInfo } from "../../../_actions/user_action";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { getCookies } from "../../../common/cookie";
import { getFileMIMEType } from "../../../common/file/file";
import { COOKIE_JWT_NAME } from "../../../common/vars/vars";
import { MSG_COMMON_FIXED, MSG_COMMON_DELETED, MSG_COMMON_FILE_NO, MSG_COMMON_FILE_ONLYIMG } from "../../../common/vars/msg";
import { Button, Form, Layout, Avatar, Space } from 'antd';
import { subMenu_myPageitems } from "../../../common/menu/sider";
import SiderPage from "../Nav/SiderPage";
import PathBar from "../Nav/PathBar";

const { Content } = Layout;

function ProfilePage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const basePath = '/users';

    // 이미 로그인되지 않은 경우 페이지 이동
    useEffect(() => {
        const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';
        if ( !x_auth ) {
            navigate("/users/login");
        }
    }, [navigate]);

    const basic_img = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const [Image, setImage] = useState(basic_img)
    const fileInput = useRef(null); // 사진 클릭시 파일 업로더 띄우도록

    // 파일 업로드 처리
    const profileImgUpload = (file) => {
        if ( !file ) {
            alert(MSG_COMMON_FILE_NO);
            return false;
        }

        const imgMimeType = getFileMIMEType(file);
        if ( !imgMimeType ) {
            alert(MSG_COMMON_FILE_ONLYIMG);
            return false;
        }

        const formData = new FormData();
        formData.append('file', file);

        dispatch(profileImgUser(formData)).then(response => {
            if ( response.payload.success ) {
                alert(MSG_COMMON_FIXED);
            }
        });
    }

    const onProfileImgChange = async (e) => {

        if(e.target.files[0]){
            await profileImgUpload(e.target.files[0]);
            setImage(e.target.files[0])
        } else {
            return;
        }
        //화면에 프로필 사진 표시
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                setImage(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    // 기존 프로필 정보 가져오기
    dispatch(getLoginInfo()).then(response => {
        if ( response.payload.success && response.payload.data.profile_img ) {
            let profileImg = `/media/${response.payload.data.profile_img}`;
            setImage(profileImg);

            // 프로필 정보 있으면 삭제버튼 표시
            document.getElementById('profileDelBtn').classList.remove('display_none');
        }
    }).catch(err => {
        console.log(err);
    });

    // 프로필 삭제 처리
    const onClickProfileImgDeleteHandler = (event) => {
        event.preventDefault();

        dispatch(profileImgDeleteUser()).then(response => {
            if ( response.payload.success ) {
                alert(MSG_COMMON_DELETED);
                window.location.reload();
                //navigate("/users/profile");
            }
        });
    }

    /*
    const [ file, setFile ] = useState(null);
    const onFileHandler = (event) => {
        setFile(event.currentTarget.files[0]);
    }
    const onClickProfileImgHandler = (values) => { // event
        //event.preventDefault();
        //profileImgUpload(file);
    }
    ...
    <Form ... onFinish={onClickProfileImgHandler} >
    <label>프로필 이미지</label>
    <input type="file" name="file" onChange={onFileHandler} accept=".png,.jpg,.jpeg,.gif,.webp" />
    */

    return (
        <Layout>
            <HeaderPage />
            <Content>
                <PathBar path2="MYPAGE" path3="PROFILE"/>
                <Layout hasSider>
                    <SiderPage menuItems={subMenu_myPageitems} defaultKeys={['profile']} openKeys={['mypage']} basePath={basePath} />
                    <Content className="basic_layout">
                        <h2>프로필 변경</h2>
                        <div>이미지 영역을 클릭하여 이미지를 변경할 수 있습니다.</div>
                        <Form name="profileFrm" labelCol={{span:12}} wrapperCol={{span:12}} encType="multipart/form-data">

                            <Avatar
                                src={Image}
                                style={{margin:'20px'}}
                                size={150}
                                onClick={()=>{fileInput.current.click()}}/>
                            <input
                                type='file'
                                style={{display:'none'}}
                                accept='image/jpg,impge/png,image/jpeg'
                                name='file'
                                onChange={onProfileImgChange}
                                ref={fileInput}/>

                        </Form>
                        <Space wrap id="profileDelBtn" className="display_none"><Button onClick={onClickProfileImgDeleteHandler}>프로필 삭제</Button></Space>

                    </Content>
                </Layout>
            </Content>
            <FooterPage />
        </Layout>
    );
}
export default ProfilePage
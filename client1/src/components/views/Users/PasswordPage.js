import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getCookies } from "../../../common/cookie";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { COOKIE_JWT_NAME } from "../../../common/vars/vars";
import { MSG_COMMON_FIXED, MSG_REGISTER_NOMATCH_PW, MSG_COMMON_FAILED, MSG_PW_CONFIRM_MSG, MSG_PW_NOW_MSG, MSG_LOGIN_PW_MSG } from "../../../common/vars/msg";
import { useDispatch } from "react-redux";
import { setUserPassword } from "../../../_actions/user_action";
import { Button, Form, Input, Layout } from 'antd';
import { subMenu_myPageitems } from "../../../common/menu/sider";
import SiderPage from "../Nav/SiderPage";
import PathBar from "../Nav/PathBar";

const { Content } = Layout;

function PasswordPage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const basePath = '/users';

    /*
    const [ nowPassword, setNowPassword ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const onNowPasswordHandler = (event) => {
        setNowPassword(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }
    */
    // 이미 로그인되지 않은 경우 페이지 이동
    useEffect(() => {
        const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';
        if ( !x_auth ) {
            navigate("/users/login");
        }
    }, [navigate]);


    const onClickPasswordHandler = (values) => {
        //event.preventDefault();
        const { nowPassword, password, confirmPassword } = values;

        if ( password !== confirmPassword ) {
            alert(MSG_REGISTER_NOMATCH_PW);
            return false;
        }
        let body = { nowPassword: nowPassword, password: password };

        dispatch(setUserPassword(body)).then(response => {
            if ( response.payload.success ) {
                alert(MSG_COMMON_FIXED);
                navigate("/users/mypage");
            } else {
                if ( response.payload.statusCode === 401 ) {
                    alert(MSG_REGISTER_NOMATCH_PW);
                } else {
                    alert(MSG_COMMON_FAILED);
                }
                return false;
            }
        }).catch(err => {
            console.log(err);
        });

        //

    }

    return (
        <Layout>
            <HeaderPage />
            <Content>
                <PathBar path2="MYPAGE" path3="PASSWORD"/>
                <Layout hasSider>
                    <SiderPage menuItems={subMenu_myPageitems} defaultKeys={['password']} openKeys={['mypage']} basePath={basePath} />
                    <Content className="basic_layout">
                        <h2>비밀번호 변경</h2>
                        <Form name="pwFrm" labelCol={{span:12}} wrapperCol={{span:12}} onFinish={onClickPasswordHandler}>
                            <Form.Item
                                label="현재 비밀번호"
                                name="nowPassword"
                                rules={[{ required: true, message: MSG_PW_NOW_MSG }]}
                                autoComplete="off"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="새 비밀번호"
                                name="password"
                                rules={[{ required: true, message: MSG_LOGIN_PW_MSG }]}
                                autoComplete="off"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="새 비밀번호 확인"
                                name="confirmPassword"
                                rules={[{ required: true, message: MSG_PW_CONFIRM_MSG }]}
                                autoComplete="off"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    비밀번호 변경
                                </Button>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
            </Content>
            <FooterPage />
        </Layout>
    );
}
export default PasswordPage
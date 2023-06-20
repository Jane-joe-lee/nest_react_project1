import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from '../../../_actions/user_action';
import { setCookies, getCookies } from "../../../common/cookie";
import { COOKIE_JWT_NAME } from "../../../common/vars/vars";
import { MSG_LOGIN_FAILED, MSG_LOGIN_NOMATCH, MSG_REGISTER_SUCCESS_TITLE, MSG_REGISTER_SUCCESS, MSG_LOGIN_ID_MSG, MSG_LOGIN_PW_MSG } from "../../../common/vars/msg";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { Button, Form, Input, Result, Layout } from 'antd';
const { Content } = Layout;

function LoginPage(props) {

    const params = new URLSearchParams(window.location.search);
    const pathParam = params.get('path');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 이미 로그인된 경우 페이지 이동
    useEffect(() => {
        const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';
        if ( x_auth ) {
            navigate("/");
        }
    }, [navigate]);
    /*
    // antd 사용시 불필요함
    // input box에 타이핑시 onChange 이벤트가 발생해 useState를 통해 값이 바뀌고 그걸 value에 넣어줌
    const [ username, setUserName ] = useState('');
    const [ password, setPassword ] = useState('');

    const onUserNameHandler = (event) => {
        setUserName(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    */
    const onSubmitHandler = (values: any) => {
        let bodyData = { username: values.username, password: values.password }
        //event.preventDefault(); // submit 누를 때마다 refresh 되는 것을 방지하기 위해 (유효성 검증을 위해)
        //let bodyData = { username: username, password: password }

        // redux 미사용시
        // axios.post('/....')

        // redux 사용시
        dispatch(loginUser(bodyData)).then(response => {
            if ( response.payload.success ) {
                const token = response.payload.data.accessToken;
                if (token) {
                    setCookies(COOKIE_JWT_NAME, token);
                    navigate("/");
                } else {
                    alert(MSG_LOGIN_FAILED);
                }
            } else {
                alert(MSG_LOGIN_NOMATCH);
            }
        });


    }

    let msgTitle, msgMessage;
    if ( pathParam && pathParam === 'register' ) {
        msgTitle = MSG_REGISTER_SUCCESS_TITLE;
        msgMessage = MSG_REGISTER_SUCCESS;
    }

    // value={username} onChange={onUserNameHandler}
    // value={password} onChange={onPasswordHandler}
    return (
        <Layout>
            <HeaderPage />
            <Content className="basic_layout">
                <h2>로그인 페이지</h2>
                <Result status="success"
                        title={msgTitle}
                        subTitle={msgMessage}
                />
                <Form name="loginFrm" labelCol={{span:8}} wrapperCol={{span:16}} onFinish={onSubmitHandler}>
                    <Form.Item
                        label="아이디"
                        name="username"
                        rules={[{ required: true, message: MSG_LOGIN_ID_MSG}]}
                        autoComplete="off"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[{ required: true, message: MSG_LOGIN_PW_MSG }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            로그인
                        </Button>
                    </Form.Item>

                </Form>
            </Content>
            <FooterPage />
        </Layout>
    );
}
export default LoginPage
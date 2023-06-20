import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from '../../../_actions/user_action';
import {
    MSG_REGISTER_FAILED,
    MSG_REGISTER_NOMATCH_PW,
    MSG_REGISTER_PW_SHORT,
    MSG_REGISTER_EXISTING,
    MSG_LOGIN_ID_MSG,
    MSG_LOGIN_PW_MSG,
    MSG_PW_CONFIRM_MSG
} from "../../../common/vars/msg";
import { getCookies } from "../../../common/cookie";
import { COOKIE_JWT_NAME } from "../../../common/vars/vars";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { Button, Form, Input, Layout } from 'antd';
const { Content } = Layout;

function RegisterPage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 이미 로그인된 경우 페이지 이동
    useEffect(() => {
        const x_auth = getCookies(COOKIE_JWT_NAME) ?? '';
        if ( x_auth ) {
            navigate("/");
        }
    }, [navigate]);

    // input box에 타이핑시 onChange 이벤트가 발생해 useState를 통해 값이 바뀌고 그걸 value에 넣어줌
    /*const [ username, setUserName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const onUserNameHandler = (event) => {
        setUserName(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }
    */

    const onSubmitHandler = (values) => {
        //event.preventDefault(); // submit 누를 때마다 refresh 되는 것을 방지하기 위해 (유효성 검증을 위해)
        const { username, password, confirmPassword } = values;

        if ( password !== confirmPassword ) {
            return alert(MSG_REGISTER_NOMATCH_PW);
        }

        let bodyData = { username: username, password: password }

        // redux 미사용시
        // axios.post('/....')

        // redux 사용시
        dispatch(registerUser(bodyData)).then(response => {
            if ( response.payload.success ) {
                navigate("/users/login?path=register");
            } else {
                if ( response.payload.statusCode === 400 ) {
                    alert(MSG_REGISTER_PW_SHORT);
                } else if ( response.payload.statusCode === 409 ) {
                    alert(MSG_REGISTER_EXISTING);
                } else {
                    alert(MSG_REGISTER_FAILED);
                }
            }
        });
    }

    // value={username} onChange={onUserNameHandler}
    // value={password} onChange={onPasswordHandler}
    // value={confirmPassword} onChange={onConfirmPasswordHandler}
    return (
        <Layout>
            <HeaderPage />
                <Content className="basic_layout">
                <h2>회원가입 페이지</h2>

                <Form name="loginFrm" labelCol={{span:8}} wrapperCol={{span:16}} onFinish={onSubmitHandler}>
                    <Form.Item
                        label="아이디"
                        name="username"
                        rules={[{ required: true, message: MSG_LOGIN_ID_MSG }]}
                        autoComplete="off"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[{ required: true, message: MSG_LOGIN_PW_MSG }]}
                        autoComplete="off"
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호 확인"
                        name="confirmPassword"
                        rules={[{ required: true, message: MSG_PW_CONFIRM_MSG }]}
                        autoComplete="off"
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            회원가입
                        </Button>
                    </Form.Item>

                </Form>

            </Content>
            <FooterPage />
        </Layout>
    );
}
export default RegisterPage
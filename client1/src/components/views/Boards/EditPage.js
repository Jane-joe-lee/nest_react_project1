import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { Button, Layout, Form, Input, Select, Upload } from 'antd';
import { subMenu_Boards } from "../../../common/menu/sider";
import SiderPage from "../Nav/SiderPage";
import PathBar from "../Nav/PathBar";
import { getBoardCreate, getBoardEdit, getBoardView } from '../../../_actions/board_action';
import {
    MSG_BBS_EDIT_NOAUTH,
    MSG_BBS_NODESCRIPTION,
    MSG_BBS_NORESULT,
    MSG_BBS_NOTITLE,
    MSG_COMMON_FAILED,
    MSG_COMMON_FIXED,
    MSG_COMMON_SAVE,
} from "../../../common/vars/msg";
import { BoardsStatus, BoardsStatusDefault } from "../../../common/vars/vars";
import { UploadOutlined } from '@ant-design/icons';
import { getCookies } from "../../../common/cookie";
import { COOKIE_USER_NAME } from "../../../common/vars/vars";


const { Content } = Layout;


function BoardsEditPage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const basePath = '/boards/list';

    // id 얻기
    const path = window.location.pathname.split('/');
    const type = path[3];
    const boardId = path[4];

    const [ fileData, setFileData ] = useState([]);
    //const [ boardData, setBoardData ] = useState([]);
    const [ file, setFile ] = useState();
    const [ oldFile, setOldFile ] = useState();

    const [form] = Form.useForm();

    const getView = () => {

        let bodyData = {
            id: boardId,
        }

        dispatch(getBoardView(bodyData)).then(response => {
            if (response.payload.success) {
                const datas = response.payload.data;

                let x_username = getCookies(COOKIE_USER_NAME) ?? '';
                if ( x_username !== datas.user.username ) {
                    alert(MSG_BBS_EDIT_NOAUTH);
                    navigate(`/boards/list/${type}`);
                } else {

                    const fileList = datas.attachedFile ? datas.attachedFile.split('|').map((file, index) => ({
                        uid: `file${index}`,
                        name: file,
                        status: 'done',
                        url: `/media/${file}`
                    })) : [];

                    //setBoardData(datas);
                    setFileData(fileList);

                    form.setFieldsValue({
                        title: datas.title ?? '',
                        status: datas.status ?? BoardsStatusDefault,
                        description: datas.description ?? '',
                        upload: fileList
                    });

                }

            } else {
                alert(MSG_BBS_NORESULT);
            }
        });
    }


    useEffect(() => {
        if ( boardId ) {
            getView();
        }
    }, []);

    let formData = new FormData();


    const onSubmitHandler = (values) => {

        if ( file ) {
            file.forEach(item => {
                formData.append('files', item);
            });
        }

        if ( oldFile ) {
            const combinedString = oldFile.join('|');
            formData.append('oldFileNames', combinedString);
        }

        formData.append('type', type);
        formData.append('id', boardId);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('status', values.status);

        if ( boardId ) { // 수정

            dispatch(getBoardEdit(formData)).then(response => {

                if (response.payload.success) {
                    alert(MSG_COMMON_FIXED);
                    navigate(`/boards/view/${type}/${boardId}`)
                } else {
                    alert(MSG_COMMON_FAILED);
                }
            });
        } else {

            dispatch(getBoardCreate(formData)).then(response => {
                if (response.payload.success) {
                    alert(MSG_COMMON_SAVE);
                    navigate(`/boards/list/${type}`)
                } else {
                    alert(MSG_COMMON_FAILED);
                }
            });
        }

    }

    // 파일 업로드 할 떄마다 action 발생 방지 위해 false 리턴
    const beforeUploadHandler = (file) => {
        return false;
    };


    const normFile = (e: any) => {

        //console.log('Upload event:', e);
        //console.log(e.fileList.originFileObj);
        //const accumulatedFiles = e.fileList.map((item) => item.originFileObj);

        let newFiles = [];
        let oldFiles = [];

        e.fileList.forEach((item) => {
            if (item.originFileObj) {
                newFiles.push(item.originFileObj);
            } else {
                oldFiles.push(item.name);
            }
        });
        setFile(newFiles);
        setOldFile(oldFiles);

        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    /*

    <Upload defaultFileList={fileData}
     */
    return (
        <Layout>
            <HeaderPage />
            <Content>
                <PathBar path2="게시판" />
                <Layout hasSider>
                    <SiderPage menuItems={subMenu_Boards} defaultKeys={['boards']} openKeys={['boards']} basePath={basePath} />
                    <Content className="basic_layout">

                        <Form name="bbsFrm" labelCol={{span:8}} wrapperCol={{span:16}} onFinish={onSubmitHandler} form={form}
                        >

                            <Form.Item
                                label="공개여부"
                                name="status"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: 120 }}
                                    options={ BoardsStatus }
                                />
                            </Form.Item>

                            <Form.Item
                                label="제목"
                                name="title"
                                rules={[{ required: true, message: MSG_BBS_NOTITLE }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="내용"
                                name="description"
                                rules={[{ required: true, message: MSG_BBS_NODESCRIPTION }]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                name="upload"
                                label="Upload"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload name="files"
                                        beforeUpload={beforeUploadHandler}
                                        multiple={true}
                                        listType="picture"
                                >
                                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    저장
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
export default BoardsEditPage
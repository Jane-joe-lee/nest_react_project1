import React, { useState, useEffect } from 'react'; // , { useEffect }
import { useNavigate } from "react-router-dom";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { Button, Layout, Descriptions, List, Space } from 'antd';
import { subMenu_Boards } from "../../../common/menu/sider";
import SiderPage from "../Nav/SiderPage";
import PathBar from "../Nav/PathBar";
import { getBoardView, getBoardDelete, getBoardUpdateLike } from '../../../_actions/board_action';
import { MSG_BBS_NORESULT, MSG_BBS_PRIVATE, MSG_COMMON_DELETED, MSG_COMMON_FAILED } from "../../../common/vars/msg";
import {
    EditOutlined, DeleteOutlined, LikeOutlined, DislikeOutlined, EyeOutlined, UserOutlined, FieldTimeOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import { getCookies } from "../../../common/cookie";
import { COOKIE_USER_NAME } from "../../../common/vars/vars";
import { useDispatch } from "react-redux";
import ImgDownAndPreview from "../File/ImgDownAndPreview";

const { Content } = Layout;


function BoardsViewPage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const basePath = '/boards/list';

    // id 얻기
    const path = window.location.pathname.split('/');
    const type = path[3];
    const boardId = path[4];

    const [ fileData, setFileData ] = useState([]);
    const [ boardData, setBoardData ] = useState([]);


    const getView = () => {

        let bodyData = {
            id: boardId,
        }

        // redux 사용
        dispatch(getBoardView(bodyData)).then(response => {
            if (response.payload.success) {
                const datas = response.payload.data;

                let x_username = getCookies(COOKIE_USER_NAME) ?? '';

                if ( datas.status === 'PRIVATE' ) {
                    if ( x_username !== datas.user.username ) {
                        alert(MSG_BBS_PRIVATE);
                        OnListMoveHandler();
                    }
                }
                if ( x_username === datas.user.username ) {
                    document.getElementById('editBtn').classList.remove('display_none');
                    document.getElementById('deleteBtn').classList.remove('display_none');
                }

                const date = new Date(datas.created_at);
                const formattedDate = date.toLocaleString('kr', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                });
                datas.created_at = formattedDate;

                datas.username = datas.user.username ?? 'unkonwn';

                setBoardData(datas);


                if ( datas.attachedFile ) {
                    setFileData(datas.attachedFile.split('|'));
                }
                // status가 PRIVATE인 경우 cookie의 let x_username = getCookies(COOKIE_USER_NAME) ?? '';와 결과의 user.username과 비교해서 같지 않으면 리스트로 리턴
            } else {
                alert(MSG_BBS_NORESULT);
            }
        });
    }

    useEffect(() => {
        getView();
    }, []);

    // 수정
    const onEditHandler = () => {
        // 수정페이지로 이동
        navigate(`/boards/edit/${type}/${boardId}`);
    };

    // 좋아요 수 업데이트
    const onUpdateLikeHandler = (likeType) => {
        const like = likeType === 'good' ? '+' : '-';

        let bodyData = {
            id: boardId,
            like: like
        }

        dispatch(getBoardUpdateLike(bodyData)).then(response => {
            if (response.payload.success) {
                window.location.reload();
            } else {
                if ( response.payload.message ) {
                    alert(response.payload.message);
                } else {
                    alert(MSG_COMMON_FAILED);
                }
            }
        });
    };

    // 삭제
    const onDeleteHandler = () => {

        let bodyData = {
            id: boardId,
        }

        dispatch(getBoardDelete(bodyData)).then(response => {
            if (response.payload.success) {
                alert(MSG_COMMON_DELETED);
                OnListMoveHandler();
            } else {
                if ( response.payload.message ) {
                    alert(response.payload.message);
                } else {
                    alert(MSG_COMMON_FAILED);
                }
            }
        });
    };

    // 리스트로 이동
    const OnListMoveHandler = () => {
        navigate(`/boards/list/${type}`);
    }

    return (
        <Layout>
            <HeaderPage />
            <Content>
                <PathBar path2="게시판" />
                <Layout hasSider>
                    <SiderPage menuItems={subMenu_Boards} defaultKeys={['boards']} openKeys={['boards']} basePath={basePath} />
                    <Content className="basic_layout">
                        <h2>{boardData.title} ({boardData.replyCnt})</h2>

                        <Descriptions title=""
                                      bordered
                                      column={{xxl: 1,xl: 1,lg: 1,md: 1,sm: 1,xs: 1,}}
                        >
                            <Descriptions.Item contentStyle={{ textAlign: "left" }}>
                                <Space align="center">
                                    <span><EyeOutlined /> {boardData.hitCnt}</span>
                                    <span> | </span>
                                    <span><LikeOutlined /> {boardData.likeCnt}</span>
                                    <span> | </span>
                                    <span><UserOutlined /> {boardData.username}</span>
                                    <span> | </span>
                                    <span><FieldTimeOutlined /> {boardData.created_at}</span>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item label="내용">
                                {boardData.description}
                            </Descriptions.Item>

                            {fileData.length > 0 && (
                                <Descriptions.Item label="첨부파일">
                                    <List
                                        dataSource={fileData}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <ImgDownAndPreview image={item} />
                                            </List.Item>
                                        )}
                                    />
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        <Space>
                            <Button onClick={OnListMoveHandler}><UnorderedListOutlined /> 목록</Button>
                            <Button id="editBtn" className="display_none" onClick={onEditHandler}><EditOutlined /> 수정</Button>
                            <Button id="deleteBtn" className="display_none" onClick={onDeleteHandler}><DeleteOutlined /> 삭제</Button>
                        </Space>


                        <Space>
                            <Button onClick={() => onUpdateLikeHandler('good')}><LikeOutlined /></Button>
                            <Button onClick={() => onUpdateLikeHandler('bad')}><DislikeOutlined /></Button>
                        </Space>



                    </Content>
                </Layout>

            </Content>
            <FooterPage />
        </Layout>
    );
}
export default BoardsViewPage
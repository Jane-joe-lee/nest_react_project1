import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import HeaderPage from "../Nav/HeaderPage";
import FooterPage from "../Nav/FooterPage";
import { Button, Form, Input, Layout, Select, Space, Table } from 'antd';
import { subMenu_Boards } from "../../../common/menu/sider";
import SiderPage from "../Nav/SiderPage";
import PathBar from "../Nav/PathBar";
import { getBoardList } from '../../../_actions/board_action';
import { MSG_BBS_SEARCH_NOENTER, MSG_BBS_SEARCH_NOSELECT } from "../../../common/vars/msg";
import { BoardsSearchDefault, BoardsSearchType } from "../../../common/vars/vars";
import { PictureTwoTone, LockTwoTone } from '@ant-design/icons';

const { Content } = Layout;

function BoardsListPage(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const basePath = '/boards/list';

    //const page = 0;
    //const pageCnt = 0;
    //let [searchType, setSearchType] = useState(BoardsSearchDefault);
    //let [searchWords, setSearchWords] = useState(''); // 비동기...onSubmitHandler에서 setSearchWords 써도 바로바로 반영되지 않는다.

    const [data, setData] = useState([]);
    const [initLoading, setInitLoading] = useState(true);

    // type 얻기
    const path = window.location.pathname.split('/');
    const type = path[3];

    const [columns, setColumns] = useState([]);

    const getList = (searchType, searchWords) => {

        let bodyData = {
            searchType: searchType,
            searchWords: searchWords,
            type: type
        }

        // redux 사용
        dispatch(getBoardList(bodyData)).then(response => {
            if (response.payload.success) {
                setData(response.payload.data);
                setInitLoading(false);
            //} else {
            //    alert(MSG_BBS_NORESULT);
            }
        });
    }


    useEffect(() => {

        if ( data.length === 0 && initLoading ) {
            getList('', '');
        }

        let lastIndex = 0
        const updateIndex = () => {
            lastIndex++
            return lastIndex
        }

        if ( data.length > 0 ) {

            const excludedColumns = ['parentId', 'type', 'description', 'likeCnt', 'updated_at', 'userId']; // 제외할 컬럼들을 배열로 정의
            const columns = Object.keys(data[0]).reduce((acc, key) => {
                if (!excludedColumns.includes(key)) {
                    if ( key === 'title' ) {
                        acc.push({
                            title: '제목',
                            dataIndex: key,
                            key: updateIndex(),
                            render: (text, record) => (
                                <div className="table_list title">
                                    <a href={`/boards/view/${type}/${record.id}`} title={text}>
                                        <span className="title">{text}</span>
                                        <span className="replyCnt">({record.replyCnt})</span>
                                        <span className="icon">{ record.attachedFile ? <PictureTwoTone /> : ''} </span>
                                        <span className="icon">{ record.status !== 'PUBLIC' ? <LockTwoTone /> : ''} </span>
                                    </a>
                                </div>
                            )
                        });
                    } else if ( key === 'hitCnt' ) {
                        acc.push({
                            title: '조회수',
                            dataIndex: key,
                            key: updateIndex(),
                        });
                    } else if ( key === 'user' ) {
                        acc.push({
                            title: '작성자',
                            dataIndex: ['user', 'username'],
                            key: updateIndex(),
                        });
                    } else if ( key === 'created_at' ) {
                        acc.push({
                            title: '작성일',
                            dataIndex: key,
                            key: updateIndex(),
                            render: (text) => {
                                const date = new Date(text);
                                const formattedDate = date.toLocaleString('kr', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                });
                                return <span>{formattedDate}</span>;
                            },
                        });
                    }
                }
                return acc;
            }, []);

            setColumns(columns);
        }

    }, [data]);

    const onSubmitHandler = (values) => {
        //event.preventDefault();
        getList(values.searchType, values.searchWords);
    }

    const onCreateHandler = () => {
        navigate(`/boards/edit/${type}`);
    }


    return (
        <Layout>
            <HeaderPage />
            <Content>
                <PathBar path2="게시판" />
                <Layout hasSider>
                    <SiderPage menuItems={subMenu_Boards} defaultKeys={['boards']} openKeys={['boards']} basePath={basePath} />
                    <Content className="basic_layout">
                        <h2>게시판</h2>

                        <Button onClick={onCreateHandler}>추가</Button>

                        <Form name="loginFrm" onFinish={onSubmitHandler}>

                            <Space.Compact >
                                <Form.Item
                                    name="searchType"
                                    rules={[{ required: true, message: MSG_BBS_SEARCH_NOSELECT}]}
                                    initialValue={BoardsSearchDefault}
                                    >
                                    <Select
                                        style={{ width: 120 }}
                                        options={ BoardsSearchType }
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="searchWords"
                                    rules={[{ required: true, message: MSG_BBS_SEARCH_NOENTER}]}
                                >
                                    <Input placeholder="검색어" style={{width: 200}}/>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        검색
                                    </Button>
                                </Form.Item>

                            </Space.Compact>
                        </Form>

                        <Table dataSource={data} columns={columns} rowKey="id" />

                    </Content>
                </Layout>

            </Content>
            <FooterPage />
        </Layout>
    );
}
export default BoardsListPage
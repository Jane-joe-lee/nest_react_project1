import React, { useState } from 'react';

import { Button, Image, Space, Tooltip } from 'antd';
import { DownloadOutlined, EyeOutlined, PictureOutlined, FileOutlined } from '@ant-design/icons';
import "../../../styles/file/ImgDownAndPreview.css";

// 파일(이미지) 표기, 다운로드, 미리보기

const ImgDownAndPreview = ({ image }) => {

    const [visible, setVisible] = useState(false);
    //const [scaleStep, setScaleStep] = useState(0.5);
    const scaleStep = 0.5;

    const isImage = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(image);

    return (
        <Space>
            { isImage ? (
                <>
                    <PictureOutlined />
                    {image}
                    <Tooltip title="다운로드">
                        <a href={`/media/${image}`} download><DownloadOutlined /></a>
                    </Tooltip>
                    <Tooltip title="미리보기">
                        <Button className="priviewBtn" type="link" onClick={() => setVisible(true)}><EyeOutlined /></Button>
                    </Tooltip>
                    <Image
                        style={{ display: 'none' }}
                        src={`/media/${image}`}
                        preview={{
                            visible,
                            scaleStep,
                            src: `/media/${image}`,
                            onVisibleChange: (value) => {
                                setVisible(value);
                            },
                        }}
                    />
                </>
            ) : (
                <>
                    <FileOutlined />
                    {image}
                    <Tooltip title="다운로드">
                        <a href={`/media/${image}`} download><DownloadOutlined /></a>
                    </Tooltip>
                </>
            )}
        </Space>
    );
};

export default ImgDownAndPreview;
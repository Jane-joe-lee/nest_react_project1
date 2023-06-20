import React from "react";
import { Breadcrumb } from 'antd';

const PathBar = ({ path2, path3 }) => {
    return (
        <Breadcrumb items={[
            { title: 'HOME' },
            { title: path2 },
            { title: path3 }
        ]} />
    );
};


export default PathBar
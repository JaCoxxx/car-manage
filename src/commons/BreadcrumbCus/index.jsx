import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

class BreadcrumbCus extends Component {
    render() {
        const { father, name } = this.props
        return (
            <span>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item><Link to={'/app/index'}>首页</Link></Breadcrumb.Item>
                    {
                        father && <Breadcrumb.Item>{father}</Breadcrumb.Item>
                    }
                    {
                        name === 'index' || <Breadcrumb.Item>{name}</Breadcrumb.Item>
                    }
                </Breadcrumb>
            </span>
        );
    }
}

export default BreadcrumbCus;
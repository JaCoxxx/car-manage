import React, { Component } from 'react'
import { Layout, Menu, Modal, Button, } from 'antd'
import { HashRouter as Router, Route } from 'react-router-dom'
// import { userLoginout } from '../../axios'
import { isOwnerLogin } from '../../utils'
import Main from './main'
import BookOrder from './bookOrder'
import About from './about'
import Personal from './personal'
import Signin from './signin'
import Signup from './signup'
import './index.css'

const { Header, Content, Footer } = Layout

class Frontend extends Component {
    state = {
        visible: false,
        signupVisible: false,
        isLogin: false,
    }

    componentWillMount() {
        isOwnerLogin().then(res => {
            console.log(res)
            this.setState({ isLogin: res.data.data })
        })
    }

    // 显示登录框
    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    // 显示注册框
    showSignupModal = () => {
        this.setState({
            signupVisible: true,
        })
    }

    // 对话框切换
    handleCancelTo = () => {
        this.setState({
            visible: !this.state.visible,
            signupVisible: !this.state.signupVisible
        })
    }

    // 关闭对话框
    handleCancel = () => {
        this.setState({
            visible: false,
            signupVisible: false,
            isLogin: true,
        })
    }

    // 点击导航
    handleMenuClick = (e) => {
        const { history } = this.props
        // const { isLogin } = this.state
        switch (e.key) {
            case '1':
                history.push('/')
                break;
            case '3':
                if (localStorage.getItem('owner')) {
                    history.push('/main/bookorder')
                } else {
                    Modal.info({
                        title: '提示',
                        content: (
                            <div>
                                <p>请登录后再来预约</p>
                            </div>
                        ),
                    });
                }
                break;
            case '4':
                history.push('/main/about')
                break;
            default:
                break;
        }
    }

    handleClickMenu = async (e) => {
        const { history } = this.props
        switch (e.key) {
            case '5':
                history.push('/main/personal')
                break;
            case '6':
                localStorage.removeItem('owner')
                // await userLoginout()
                history.push('/')
                break;
            default:
                break;
        }
    }

    handleClickAdmin = () => {
        const { history } = this.props
        history.push('/app/index')
    }

    render() {
        const { signupVisible, visible } = this.state
        return (
            <Layout className="layout">
                <Header>
                    <div className="logo">保车网</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px', float: 'left' }}
                        onClick={this.handleMenuClick}
                    >
                        <Menu.Item key="1">主页</Menu.Item>
                        <Menu.Item key="3">预约下单</Menu.Item>
                        <Menu.Item key="4">关于我们</Menu.Item>
                    </Menu>
                    {
                        localStorage.getItem('owner')
                            ? <Menu
                                theme="dark"
                                mode="horizontal"
                                style={{ lineHeight: '64px', float: 'right' }}
                                onClick={this.handleClickMenu}
                            >
                                <Menu.Item key="5">个人中心</Menu.Item>
                                <Menu.Item key="6">退出</Menu.Item>
                            </Menu>
                            : <Menu
                                theme="dark"
                                mode="horizontal"
                                style={{ lineHeight: '64px', float: 'right' }}
                            >

                                <Menu.Item key="5" onClick={this.showModal}>登录</Menu.Item>
                                <Menu.Item key="6" onClick={this.showSignupModal}>注册</Menu.Item>
                            </Menu>
                    }
                </Header>
                <Content style={{ padding: '0 50px', backgroundColor: '#fff' }}>
                    <div style={{ padding: 24, minHeight: 280 }}>
                        <Router>
                            <Route path="/main/index" component={Main} />
                            <Route path="/main/bookorder" component={BookOrder} />
                            <Route path="/main/about" component={About} />
                            <Route path="/main/personal" component={Personal} />
                        </Router>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    保车网 ©2019 zhiyuan.wu 版权所有
                </Footer>
                <Modal
                    visible={visible}
                    title="登录"
                    onCancel={this.handleCancel}
                    footer={[
                        <span style={{ float: 'left', lineHeight: '32px' }} key="admin" onClick={this.handleClickAdmin}>管理员登录</span>,
                        <span key="text">还没有账号？</span>,
                        <Button key="signup" onClick={this.handleCancelTo}>注册</Button>,
                        <Button key="back" onClick={this.handleCancel}>关闭</Button>,
                    ]}
                >
                    <Signin setModal={this.handleCancel} />
                </Modal>
                <Modal
                    visible={signupVisible}
                    title="注册"
                    onCancel={this.handleCancel}
                    footer={[
                        <span key="text">已有账号？</span>,
                        <Button key="signup" onClick={this.handleCancelTo}>登录</Button>,
                        <Button key="back" onClick={this.handleCancel}>
                            关闭
                            </Button>,
                    ]}
                >
                    <Signup setModal={this.handleCancelTo} />
                </Modal>
            </Layout>

        );
    }
}

export default Frontend
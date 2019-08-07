import React, { Component } from 'react';
import screenfull from 'screenfull'
import { Menu, Icon, Layout, Badge, Popover, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
import SiderCus from '../SiderCus'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setIsMobile, setUser } from '../../reducer/actions'

const { Header } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class MainHeader extends Component {
    state = {
        user: '',
        visible: false,
    }
    // 全屏
    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request()
        }
    }

    // 子菜单
    handleClickTitle = ({ key }) => {
        const { push } = this.props.history
        switch (key) {
            case 'setting:2':
                return push('/app/message')
            default:
                break;
        }
    }

    // 隐藏侧边栏
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    }

    // 控制侧边导航的显示
    handleVisibleChange = visible => {
        console.log(visible)
        this.setState({ visible })
    }
    // 退出登录
    logout = () => {
        const { setUser, history } = this.props
        localStorage.removeItem('user')
        setUser({})
        history.push('/login')
    }
    render() {
        const { user = JSON.parse(localStorage.getItem('user')), isMobile = false, path, collapsed, toggle } = this.props
        console.log(user);
        return (
            <Header className="custom-theme header"  >
                {
                    isMobile ? (
                        <Popover content={<SiderCus path={path} popoverHide={this.popoverHide} />} trigger="click" placement="bottomLeft" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="header__trigger custom-trigger" />
                        </Popover>
                    ) : (
                            <Icon
                                className="header__trigger custom-trigger"
                                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={toggle}
                            />
                        )
                }
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.menuClick}
                >
                    {/* <Menu.Item key="pwa">
                        <PwaInstaller />
                    </Menu.Item> */}
                    <Menu.Item key="full" onClick={this.screenFull} >
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    {/* <Menu.Item key="1" onClick={this.handleClickToMessage}>
                        {/* <Badge count={25}>
                            <Icon type="notification" onClick={this.handleClickToMessage} />
                        </Badge> */}
                    {/* <Badge count={5} dot style={{ marginLeft: 15 }} >
                            <Icon type="notification" onClick={this.handleClickToMessage} />
                        </Badge>
                    </Menu.Item> */}
                    <SubMenu onClick={this.handleClickTitle} title={<span className="avatar"> <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{user.userName && user.userName.slice(0, 1)}</Avatar> </span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">你好 - {user.role}</Menu.Item>
                            <Menu.Item key="setting:2">个人信息</Menu.Item>
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                        {/* <MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup> */}
                    </SubMenu>
                </Menu>
            </Header>
        );
    }
}

MainHeader.propTypes = {
    user: PropTypes.object,
    isMobile: PropTypes.bool,
    setIsMobile: PropTypes.func,
    setUser: PropTypes.func
}

const mapStateToProps = ({ UserPer, Responsive }) => {
    return {
        user: UserPer.user,
        isMobile: Responsive.isMobile
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setIsMobile(isMobile) {
            dispatch(setIsMobile(isMobile))
        },
        setUser(user) {
            dispatch(setUser(user))
        }
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainHeader));
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import routes from '../../routes/config';
import { isLogin } from '../../utils'
// import SiderMenu from './SiderMenu'
import { Link } from 'react-router-dom';
import { setMounted } from '../../reducer/actions';

const { Sider } = Layout

class SiderCus extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.collapsed !== state.collapsed) {
            const state1 = SiderCus.setMenuOpen(props);
            const state2 = SiderCus.onCollapse(props.collapsed);
            return {
                ...state1,
                ...state2,
                firstHide: state.collapsed !== props.collapsed && props.collapsed, // 两个不等时赋值props属性值否则为false
                openKey: state.openKey || (!props.collapsed && state1.openKey)
            }
        }
        return null;
    }
    static setMenuOpen = props => {
        const { pathname } = props.location;
        return {
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: pathname
        };
    };
    static onCollapse = (collapsed) => {
        return {
            collapsed,
            // firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        };
    };
    state = {
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
    componentDidMount() {
        this.props.setMounted(true)
        const state = SiderCus.setMenuOpen(this.props);
        this.setState(state);
    }
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const { popoverHide } = this.props; // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    componentWillUnmount() {
        console.log(this.props.isMounted)
        this.props.setMounted(false)
    }

    // item.route 菜单单独跳转的路由
    renderMenuItem = item => {
        if (isLogin().user.roleType === item.roleType || item.roleType === 0 || isLogin().user.roleType === 999 || !item.roleType) return (
            <Menu.Item
                key={item.key}
            >
                <Link to={(item.route || item.key) + (item.query || '')}>
                    {item.icon && <Icon type={item.icon} />}
                    <span className="nav-text">{item.title}</span>
                </Link>
            </Menu.Item>
        )

        return null
    };

    renderSubMenu = item => {
        if (isLogin().user.roleType === item.roleType || item.roleType === 0 || isLogin().user.roleType === 999) return (
            <Menu.SubMenu
                key={item.key}
                title={
                    <span>
                        {item.icon && <Icon type={item.icon} />}
                        <span className="nav-text">{item.title}</span>
                    </span>
                }
            >
                {item.subs.map(item => this.renderMenuItem(item))}
            </Menu.SubMenu>
        )

        return null
    };

    render() {
        const { selectedKey, openKey, firstHide, collapsed } = this.state;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={collapsed}
                style={{ overflowY: 'auto' }}
            >
                <div className="logo" />
                <Menu
                    menus={routes.menus}
                    onClick={this.menuClick}
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}
                >
                    {routes.menus && routes.menus.map(item =>
                        item.subs ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    )}
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

const mapStateToProps = ({ Responsive }) => {
    return {
        isMounted: Responsive.isMounted
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMounted(isMounted) {
            dispatch(setMounted(isMounted))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SiderCus));
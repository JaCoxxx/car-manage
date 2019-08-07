import React, { Component } from 'react';
import { Layout } from 'antd'
import Router from '../../routes'
import AllCommons from '../index'
import ThemePicker from '../Widget/ThemePicker'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setUser, setIsMobile, setMounted } from '../../reducer/actions'

const { Content, Footer } = Layout

class Page extends Component {
    state = {
        collapsed: false
    }
    componentWillMount() {
        // const { setAlitaState } = this.props;
        // const user = JSON.parse(localStorage.getItem('user'));
        // // user && receiveData(user, 'auth');
        // user && setAlitaState({ stateName: 'auth', data: user });
        // // receiveData({a: 213}, 'auth');
        // // fetchData({funcName: 'admin', stateName: 'auth'});
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
    }
    // 获取当前浏览器宽度并设置responsive管理响应式
    getClientWidth = () => {
        const { setIsMobile, setMounted } = this.props;
        const clientWidth = window.innerWidth;
        let flag = clientWidth <= 992
        setIsMobile( flag )
        setMounted( !flag )
    };
    // 侧栏显示/隐藏
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { user = {}, isMobile = false, isMounted = false } = this.props
        const { collapsed } = this.state
        console.log(isMounted, isMobile)
        return (
            <div style={{ height: '100%' }}>
                <Layout>
                    {!isMobile && isMounted && <AllCommons.SiderCus collapsed={ collapsed } />}
                    <ThemePicker />
                    <Layout style={{ flexDirection: 'column' }}>
                        <AllCommons.MainHeader toggle={this.toggle} collapsed={this.state.collapsed} user={user || {}} />
                        <Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
                            <Router auth={ user } />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            维修保养管理中心 ©{new Date().getFullYear()} Created by Zhiyuan.Wu
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

Page.propTypes = {
    user: PropTypes.object,
    isMobile: PropTypes.bool,
    isMounted: PropTypes.bool,
    setUser: PropTypes.func,
    setIsMobile: PropTypes.func,
    setMounted: PropTypes.func
}

const mapStateToProps = ({ UserPer, Responsive }) => {
    return {
        user: UserPer.user,
        isMobile: Responsive.isMobile,
        isMounted: Responsive.isMounted
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser(user) {
            dispatch(setUser(user))
        },
        setIsMobile(isMobile) {
            dispatch(setIsMobile(isMobile))
        },
        setMounted(isMounted) {
            dispatch(setMounted(isMounted))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
// import { PwaInstaller } from '../widget';
import { isLogin } from '../../utils'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setUser, setPermissions } from '../../reducer/actions'
import { empLogin } from '../../axios'
import DocumentTitle from 'react-document-title'

const FormItem = Form.Item;

class Login extends Component {
    componentWillMount() {
        if (isLogin()._isLogin) this.props.history.push('/')
    }
    componentDidMount() {
        const { setUser } = this.props;
        setUser({})
    }
    componentDidUpdate(prevProps) { // React 16.3+弃用componentWillReceiveProps
        const { user = {}, history } = this.props;
        // const { history } = this.props;
        if (user && user.uid) { // 判断是否登陆
            localStorage.setItem('user', JSON.stringify(user));
            history.push('/app/index');
        }
    }

    // 登录
    handleSubmit = (e) => {
        e.preventDefault();
        const { setUser } = this.props
        const { validateFields, setFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                empLogin(values)
                    .then(res => {
                        if (res.data.success) {
                            setUser({
                                uid: res.data.data.id,
                                role: res.data.data.position,
                                roleType: res.data.data.role - 0,
                                userName: res.data.data.username,
                            })
                        } else {
                            setFields({
                                userName: {
                                    value: values.userName,
                                    errors: []
                                },
                                password: {
                                    errors: [new Error(res.data.message)]
                                }
                            })
                        }

                    })
            } else {
                console.log(err);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <DocumentTitle title='登录-后台'>
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>维修保养后台管理系统</span>
                        {/* <PwaInstaller /> */}
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <span className="login-form-forgot" href="" style={{ float: 'right' }}>忘记密码</span>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
            </DocumentTitle>
        );
    }
}

Login.propTypes = {
    user: PropTypes.object,
    permissions: PropTypes.array,
    setUser: PropTypes.func,
    setPermissions: PropTypes.func
}

const mapStateToProps = ({ UserPer }) => {
    return {
        user: UserPer.user,
        permissions: UserPer.permissions
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser(user) {
            dispatch(setUser(user))
        },
        setPermissions(permissions) {
            dispatch(setPermissions(permissions))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login));
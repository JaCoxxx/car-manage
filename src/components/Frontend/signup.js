import React, { Component } from 'react'
import { Form, Icon, Input, Button, } from 'antd'
import { userReg } from '../../axios'
import { format } from '../../utils'

class Signup extends Component {
    state = {
        confirmDirty: false,
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不相同!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { setModal } = this.props
        const { setFields, setFieldsValue, validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                userReg({
                    id: +new Date() + 'owner',
                    username: values.username,
                    password: values.password,
                    sex: '男',
                    phone: values.phone,
                    email: '',
                    model: '',
                    plate: '',
                    reg_date: format(new Date(), 'yy-MM-dd hh:mm:ss'),
                    car_date: '2018-08-08',
                    note: ''
                })
                    .then(res => {
                        if (res.data.success) {
                            setFieldsValue({
                                'username': null,
                                'password': null,
                                'confim': null,
                                'phone': null
                            })
                            setModal()
                        } else {
                            setFields({
                                'phone': {
                                    value: null,
                                    errors: [new Error(res.data.message)]
                                }
                            })
                        }
                    })
                    .catch(err => console.log(err))
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [
                            {
                                required: true,
                                message: '请输入姓名!'
                            },
                        ],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
                    )}
                </Form.Item>
                <Form.Item
                    extra="手机号将用于接收通知短信，请务必保证正确."
                >
                    {getFieldDecorator('phone', {
                        rules: [
                            {
                                required: true,
                                message: '请输入手机号!'
                            },
                            {
                                pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                                message: '请输入正确格式的手机号'
                            },
                        ],
                    })(
                        <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '请输入密码!' },
                            {
                                validator: this.validateToNextPassword,
                            }
                        ],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('confirm', {
                        rules: [
                            { required: true, message: '请确认你的密码!' },
                            {
                                validator: this.compareToFirstPassword,
                            }
                        ],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="确认密码"
                            onBlur={this.handleConfirmBlur} />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">注册</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'signup' })(Signup);
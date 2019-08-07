import React, { Component } from 'react'
import { Form, Icon, Input, Checkbox, Button, } from 'antd'
import { userLogin } from '../../axios'

class Signin extends Component {
    handleSubmit = (e) => {
        e.preventDefault()
        const { setModal } = this.props
        const { setFields, setFieldsValue, validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                userLogin({
                    name: values.username,
                    password: values.password
                })
                    .then(res => {
                        if (res.data.success) {
                            setFieldsValue({
                                'username': null,
                                'password': null,
                            })
                            localStorage.setItem('owner', values.username)
                            setModal()
                        } else {
                            setFields({
                                'password': {
                                    value: null,
                                    errors: [new Error(res.data.message)]
                                }
                            })
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入你的手机号!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </Form.Item>

            </Form>
        );
    }
}

export default Form.create({ name: 'signin' })(Signin);
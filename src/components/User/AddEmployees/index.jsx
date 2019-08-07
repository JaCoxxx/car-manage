import React, { Component } from 'react'
import {
    Form, Input, Button, Radio, Modal, Icon
} from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import { addEmployees } from '../../../reducer/actions';
import { addEmpByAdmin, getAllEmp } from '../../../reducer/employees'

class AddRmplyoees extends Component {

    async componentDidMount() {
        const { getEmp } = this.props
        await getEmp()
        this.getNewId()
    }

    // 提交按钮
    handleSubmit = (e) => {
        e.preventDefault();
        const { form, addEmployees } = this.props
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                addEmployees({
                    ...values,
                    password: '123456',
                    key: values.id + ''
                })
                this.confirm(values)
            }
        });
    }

    // 获取最新的ID
    getNewId = () => {
        const { employees, form } = this.props
        const { setFieldsValue } = form
        setFieldsValue({
            'id': Math.max(...employees.map(item => item.id)) + 1,
            'username': null,
            'phone': null,
            'position': null,
            'sex': null,
        })
    }

    // 提交后的提示框
    confirm = (values) => {
        console.log(values)
        Modal.confirm({
            title: '添加成功',
            content: `该员工登录名为：${values.id}，初始密码为：123456,点击确认跳转至员工查看界面，点击取消继续添加员工`,
            onOk: this.handleClickOk,
            onCancel: this.handleClickCancel,
            okText: '确认',
            cancelText: '取消',
            icon: <Icon type="check-circle" />,
        })
    }

    // 点击确认页面跳转
    handleClickOk = () => {
        const { push } = this.props.history
        push('/app/user/showemployees')
    }

    // 点击取消刷新页面
    handleClickCancel = () => {
        this.getNewId()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },

            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 8 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        }
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="工号">
                    {
                        getFieldDecorator('id')(
                            <Input disabled type="number" />
                        )
                    }
                </Form.Item>
                <Form.Item label="姓名">
                    {
                        getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入姓名',
                                }
                            ],
                        })(
                            <Input placeholder="例如：张三" />
                        )
                    }
                </Form.Item>
                <Form.Item label="手机号">
                    {
                        getFieldDecorator('phone', {
                            rules: [
                                {
                                    reuqired: true,
                                    message: '请输入手机号',
                                },
                                {
                                    pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                                    message: '请输入正确格式的手机号'
                                },
                            ],
                        })(
                            <Input placeholder="例如：12345678901" />
                        )
                    }
                </Form.Item>
                <Form.Item label="职务">
                    {
                        getFieldDecorator('position', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择该员工职务',
                                }
                            ],
                        })(
                            <Radio.Group>
                                <Radio.Button value="维修工程师">维修工程师</Radio.Button>
                                <Radio.Button value="维修顾问">维修顾问</Radio.Button>
                                <Radio.Button value="财务结算员">财务结算员</Radio.Button>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
                <Form.Item label="性别">
                    {
                        getFieldDecorator('sex', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择该员工性别',
                                }
                            ],
                        })(
                            <Radio.Group>
                                <Radio.Button value="男">男</Radio.Button>
                                <Radio.Button value="女">女</Radio.Button>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        );
    }
}

AddRmplyoees.propTypes = {
    employees: PropTypes.array,
    addEmployees: PropTypes.func,
    getEmp: PropTypes.func
}

const mapStateToProps = ({ Employees }) => {
    return {
        employees: Employees.employees
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addEmployees(employees) {
            return addEmpByAdmin(employees)(dispatch)
        },
        getEmp() {
            getAllEmp()(dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'register' })(AddRmplyoees))
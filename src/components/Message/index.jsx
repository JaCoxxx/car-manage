import React, { Component } from 'react'
import { Card, List, Tabs, Table, Button, Modal, message, Form, Input } from 'antd'
import { queryEmpById, changeEmpPwd, queryOrderByEmp } from '../../axios'
import { format } from '../../utils'

const TabPane = Tabs.TabPane

class Message extends Component {
    state = {
        data: {},
        order: [],
        visible: false,
    }
    componentDidMount() {
        queryEmpById(JSON.parse(localStorage.getItem('user')).uid)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        data: res.data.data[0]
                    })
                    queryOrderByEmp(res.data.data[0].id)
                        .then(res => {
                            if (res.data.success) {
                                this.setState({
                                    order: res.data.data.map(item => ({
                                        ...item,
                                        time: format(new Date(item.time), 'yyyy-MM-dd'),
                                        key: item.id,
                                    }))
                                })
                            }
                        })
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    }
    handleChangePwd = () => {
        console.log(localStorage.getItem('user'))
        this.setState({
            visible: true
        })
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('rpassword')) {
            callback('两次密码不一致!')
        } else {
            callback()
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true })
        }
        if (value && value === form.getFieldValue('password')) {
            callback('新旧密码不能相同!')
        } else {
            callback()
        }
    }

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    handleOk = e => {
        e.preventDefault()
        const { setFields, setFieldsValue } = this.props.form
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values)
                changeEmpPwd({
                    password: values.password,
                    rpassword: values.rpassword,
                    username: JSON.parse(localStorage.getItem('user')).uid
                })
                    .then(res => {
                        console.log(res)
                        if (res.data.success) {
                            message.success('修改成功，下次登录请使用新密码登录')
                            this.setState({
                                visible: false
                            })
                            setFieldsValue({
                                'password': null,
                                'rpassword': null,
                                'confirm': null,
                            })
                        } else {
                            setFields({
                                'password': {
                                    value: null,
                                    errors: [new Error('原密码错误')]
                                }
                            })
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    render() {
        const { data, visible, order } = this.state
        const { getFieldDecorator } = this.props.form
        const columns = [
            { title: '单号', dataIndex: 'id', key: 'id', },
            { title: '详情', dataIndex: 'information', key: 'information', },
            { title: '车牌', dataIndex: 'plate', key: 'plate', },
            { title: '时间', dataIndex: 'time', key: 'time', },
        ]
        return (
            <div>
                <Card title="个人中心" bordered={false} style={{ width: '100%' }} extra={<Button onClick={this.handleChangePwd}>修改密码</Button>}>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="个人信息" key="1">
                            <List
                                itemLayout="horizontal"
                            >
                                <List.Item>
                                    <List.Item.Meta
                                        title={<span>工号</span>}
                                        description={data.id}
                                    />
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta
                                        title={<span>姓名</span>}
                                        description={data.username}
                                    />
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta
                                        title={<span>职务</span>}
                                        description={data.position}
                                    />
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta
                                        title={<span>手机号</span>}
                                        description={data.phone}
                                    />
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta
                                        title={<span>性别</span>}
                                        description={data.sex}
                                    />
                                </List.Item>
                            </List>
                        </TabPane>
                        <TabPane tab="我的订单" key="2">
                            <Table
                                className="components-table-demo-nested"
                                columns={columns}
                                rowKey={record => record.id}
                                dataSource={order}
                            />
                        </TabPane>

                    </Tabs>

                    <Modal
                        title="结算"
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <Form>
                            <Form.Item label="旧密码">
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入你的旧密码!',
                                        },
                                    ],
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="新密码">
                                {getFieldDecorator('rpassword', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入密码!',
                                        },
                                        {
                                            pattern: /^[a-zA-Z]\w{5,15}$/,
                                            message: '请输入以字母开头，长度在6~16之间，只能包含字母、数字和下划线'
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                    ],
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="确认密码">
                                {getFieldDecorator('confirm', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请确认你的新密码!',
                                        },
                                        {
                                            validator: this.compareToFirstPassword,
                                        },
                                    ],
                                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>
            </div>
        );
    }
}

export default Form.create({ name: 'change_pwd' })(Message)
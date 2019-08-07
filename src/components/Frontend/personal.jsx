import React, { Component } from 'react'
import { Card, List, Tabs, Table, Button, Modal, message, Radio, Form, Input } from 'antd'
import { queryUserByPhone, queryOrderByOwner, queryOrderByStatus, queryOrderById, addOrderStatus, changeUserPwd } from '../../axios'
import { format } from '../../utils'
import OrderDetails from '../Order/OrderDetails'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import DocumentTitle from 'react-document-title'

import './index.css'

const TabPane = Tabs.TabPane

class Personal extends Component {
    state = {
        loading: true,
        orderLoading: true,
        visible: false,
        pwdvisible: false,
        data: {},
        order: [],
        settOrder: [],
        price: 0,
        id: '',
    }
    componentDidMount() {
        queryUserByPhone(localStorage.getItem('owner'))
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data
                    this.setState({ data, loading: false })
                    queryOrderByOwner(data.id)
                        .then(reslove => {
                            console.log(reslove)
                            if (reslove.data.success) {
                                const orderData = reslove.data.data.map(item => {
                                    return {
                                        ...item,
                                        time: format(new Date(item.time), 'yyyy-MM-dd hh:mm:ss')
                                    }
                                })
                                this.setState({ order: orderData, orderLoading: false })
                            } else {

                            }
                        })
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
        this.getOrder()
    }

    getOrder = () => {
        queryOrderByStatus(['4', '10004'])
            .then(res => {
                if (res.data.success) {
                    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                        console.log(res.data.data);
                        this.setState({
                            settOrder: res.data.data.map(item => ({
                                ...item,
                                time: format(new Date(item.time), 'yyyy-MM-dd'),
                                key: item.id
                            })),
                        })
                    }

                }
            })
    }

    handleClickDis = (id) => {
        queryOrderById(id)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        price: res.data.data[0].price - 0,
                        visible: true,
                        id,
                    })
                }
            })
    }
    handleOk = () => {
        const { id } = this.state
        addOrderStatus({
            status_id: +new Date(),
            order_id: id,
            status: '5',
            status_time: moment().format('YYYY-MM-DD hh:mm:ss'),
            emp_id: '10004',
        })
            .then(res => {
                if (res.data.success) {
                    message.success('结算成功')
                    this.setState({
                        visible: false,
                    })
                    this.getOrder()
                }
            })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    handleChangePwd = () => {
        console.log(localStorage.getItem('owner'))
        this.setState({
            pwdvisible: true
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

    handlePOk = e => {
        e.preventDefault()
        const { setFields, setFieldsValue } = this.props.form
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                changeUserPwd({
                    password: values.password,
                    rpassword: values.rpassword,
                    username: localStorage.getItem('owner')
                })
                    .then(res => {
                        if (res.data.success) {
                            message.success('修改成功，下次登录请使用新密码登录')
                            this.setState({
                                pwdvisible: false
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

    handlePCancel = () => {
        this.setState({
            pwdvisible: false,
        })
    }

    render() {
        const { data, loading, order, orderLoading, settOrder, visible, price, pwdvisible } = this.state
        const { order: o } = this.props
        const { getFieldDecorator } = this.props.form
        const ordersTatus = o.orderStatus
        const columns = [
            {
                title: '单号',
                dataIndex: 'id',
                sorter: true,
                width: '25%',
            },
            {
                title: '时间',
                dataIndex: 'time',
                sorter: true,
                width: '25%',
            },
            {
                title: '描述',
                dataIndex: 'information',
                sorter: true,
                width: '30%',
            },
            // {
            //     title: '操作',
            //     dataIndex: '',
            //     key: 'x',
            //     render: () => <Button>查看详细内容</Button>,
            // }
        ]
        const settColumns = [
            { title: '单号', dataIndex: 'id', key: 'id', },
            { title: '详情', dataIndex: 'information', key: 'information', },
            { title: '车牌', dataIndex: 'plate', key: 'plate', },
            { title: '时间', dataIndex: 'time', key: 'time', },
            { title: '操作', key: 'action', render: (text, record) => <Button onClick={() => this.handleClickDis(record.id)}>账单结算</Button> }
        ]
        return (
            <DocumentTitle title="个人中心-保车网">
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Card title="个人中心" bordered={false} style={{ width: '100%' }} extra={<Button onClick={this.handleChangePwd}>修改密码</Button>}>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="个人信息" key="1">
                                <List
                                    itemLayout="horizontal"
                                    loading={loading}
                                >
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<span>姓名</span>}
                                            description={data.username}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<span>性别</span>}
                                            description={data.sex}
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
                                            title={<span>邮箱</span>}
                                            description={data.email}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<span>车辆型号</span>}
                                            description={data.model}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<span>车牌</span>}
                                            description={data.plate}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<span>购车日期</span>}
                                            description={format(new Date(data.car_date), 'yyyy-MM-dd')}
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
                                    loading={orderLoading}
                                    expandedRowRender={(e) => OrderDetails(e, ordersTatus)}
                                />
                            </TabPane>
                            <TabPane tab="待结算订单" key="3">
                                <Table
                                    columns={settColumns}
                                    rowKey={record => record.id}
                                    dataSource={settOrder}
                                    loading={orderLoading}
                                    expandedRowRender={(e) => OrderDetails(e, ordersTatus)}
                                />
                            </TabPane>
                        </Tabs>
                        <Modal
                            title="结算"
                            visible={visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <div>总价：{price}元</div>
                            <div>请选择付款方式</div>
                            <Radio.Group onChange={this.handleSizeChange}>
                                <Radio.Button value="large">支付宝</Radio.Button>
                                <Radio.Button value="default">微信</Radio.Button>
                                <Radio.Button value="small">银联</Radio.Button>
                            </Radio.Group>
                        </Modal>
                        <Modal
                            title="修改密码"
                            visible={pwdvisible}
                            onOk={this.handlePOk}
                            onCancel={this.handlePCancel}
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
            </DocumentTitle>
        );
    }
}

Personal.propTypes = {
    order: PropTypes.object,
}

const mapStateToProps = ({ Order }) => {
    return {
        order: Order,
    }
}

export default Form.create({ name: 'change_pwd' })(connect(mapStateToProps)(Personal))
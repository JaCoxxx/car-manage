import React, { Component } from 'react'
import { queryOrderByStatus, queryPartById, addOrderPrice, addOrderStatus } from '../../axios'
import { Button, Table, Card, Modal, List, message } from 'antd'
import { format } from '../../utils'
import moment from 'moment'

class Financial extends Component {
    state = {
        data: [],
        visible: false,
        id: '',
        partData: [],
        price: 0,
    }
    componentDidMount() {
        this.getOrder()
    }
    // 获取当前阶段的订单
    getOrder = () => {
        queryOrderByStatus(['3', JSON.parse(localStorage.getItem('user')).uid])
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.data);
                    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                        this.setState({
                            data: res.data.data.map(item => ({
                                ...item,
                                time: format(new Date(item.time), 'yyyy-MM-dd'),
                                key: item.id
                            }))
                        })
                    }

                }
            })
    }
    handleClickDis = (id) => {
        queryPartById(id)
            .then(res => {
                if (res.data.success) {
                    let price = 0
                    res.data.data.map(item => {
                        price += (item.num - 0) * (item.price - 0)
                        return item
                    })
                    res.data.data.unshift({
                        name: '名称',
                        price: '单价',
                        num: '数量',
                    })
                    this.setState({
                        partData: res.data.data,
                        price,
                        visible: true,
                        id,
                    })
                }
            })
    }

    handleOk = () => {
        const { id, price } = this.state
        addOrderPrice({
            price,
            id
        })
            .then(res => {
                if (res.data.success) {
                    message.success('核对成功')
                    addOrderStatus({
                        status_id: +new Date(),
                        order_id: id,
                        status: '4',
                        status_time: moment().format('YYYY-MM-DD hh:mm:ss'),
                        emp_id: '10004',
                    })
                        .then(res => {
                            console.log(res)
                            if (res.data.success) {
                                this.setState({
                                    visible: false,
                                })
                                this.getOrder()
                            }
                        })
                } else {
                    message.warning(res.data.message)
                }
            })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
    render() {
        const { data, visible, partData, price } = this.state
        const columns = [
            { title: '单号', dataIndex: 'id', key: 'id', },
            { title: '详情', dataIndex: 'information', key: 'information', },
            { title: '车牌', dataIndex: 'plate', key: 'plate', },
            { title: '时间', dataIndex: 'time', key: 'time', },
            { title: '操作', key: 'action', render: (text, record) => <Button onClick={() => this.handleClickDis(record.id)}>核对账单</Button> }
        ]
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="待核对订单" bordered={false} >
                    <Table columns={columns} dataSource={data} />
                </Card>
                <Modal
                    title="核对账单"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        loading={false}
                        dataSource={partData}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    style={{ width: '200px' }}
                                    title={item.name}
                                />
                                <div style={{ padding: '0 60px', textAlign: 'center' }}>{item.num}</div>
                                <div style={{ padding: '0 60px', textAlign: 'center' }}>{item.price}</div>
                            </List.Item>
                        )}
                    >
                        <List.Item>
                            <List.Item.Meta
                                style={{ width: '200px' }}
                                title='总价'
                            />
                            <div style={{ padding: '0 60px', textAlign: 'center' }}>{price}</div>
                        </List.Item>
                    </List>
                </Modal>
            </div>
        );
    }
}

export default Financial;
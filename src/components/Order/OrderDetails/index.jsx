import React, { Component } from 'react';
import { Table } from 'antd'
import { queryUserById, queryOrderPart, queryOrderStatus, } from '../../../axios'
import { format } from '../../../utils'

class OrderChidren extends Component {
    state = {
        ownerData: [],
        partData: [],
        orderData: [],
    }
    componentDidMount() {
        const { order } = this.props
        this.getData(order)
    }
    getData = (e) => {
        const { status } = this.props
        queryUserById(e.owner_id)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        ownerData: res.data.data.map(item => ({
                            ...item,
                            car_date: format(new Date(item.car_date), 'yyyy-MM-dd'),
                            key: item.id
                        }))
                    })
                }
            })
        queryOrderPart(e.id)
            .then(res => {
                if (res.data.data) {
                    this.setState({
                        partData: res.data.data.map(item => ({
                            ...item,
                            key: item.part_id
                        }))
                    })
                }
            })
        queryOrderStatus(e.id)
            .then(res => {
                if (res.data.data) {
                    this.setState({
                        orderData: res.data.data.map(item => ({
                            ...item,
                            status: status[item.status - 0],
                            status_time: format(new Date(item.status_time), 'yyyy-MM-dd hh:mm:ss'),
                            key: item.status_id
                        }))
                    })
                }
            })
    }
    render() {
        const { ownerData, partData, orderData } = this.state
        const ownerColumns = [
            { title: '姓名', dataIndex: 'username', key: 'username', },
            { title: '手机号', dataIndex: 'phone', key: 'phone', },
            { title: '邮箱', dataIndex: 'email', key: 'email', },
            { title: '车辆型号', dataIndex: 'model', key: 'model', },
            { title: '购车日期', dataIndex: 'car_date', key: 'car_date', },
        ]
        const partColumns = [
            { title: '名称', dataIndex: 'name', key: 'name', },
            { title: '数量', dataIndex: 'num', key: 'num', },
            { title: '单价', dataIndex: 'price', key: 'price', },
        ]

        const orderColumns = [
            { title: '当前状态', dataIndex: 'status', key: 'status', },
            { title: '时间', dataIndex: 'status_time', key: 'status_time', },
            { title: '负责人', dataIndex: 'emp_id', key: 'emp_id', },
        ]
        return (
            <div>
                <Table title={() => '车主信息'} pagination={false} columns={ownerColumns} dataSource={ownerData} />
                <Table title={() => '零件信息'} pagination={false} columns={partColumns} dataSource={partData} />
                <Table title={() => '订单进度'} pagination={false} columns={orderColumns} dataSource={orderData} />
            </div>
        )
    }
}

const OrderDetails = (e, status) => {
    return (
        <OrderChidren order={e} status={status} />
    )
}

export default OrderDetails;
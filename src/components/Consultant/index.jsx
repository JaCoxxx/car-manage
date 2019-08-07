import React, { Component } from 'react'
import { queryOrderByStatus, queryEmpByRole, addOrderStatus } from '../../axios'
import { Button, Table, Card, Modal, Select } from 'antd'
import { format } from '../../utils'
import moment from 'moment'

const Option = Select.Option

class Consultant extends Component {
    state = {
        data: [],
        visible: false,
        id: '',
        emp: [],
        empId: '',
        recommended: '',
    }
    componentDidMount() {
        this.getOrder()
    }
    // 获取当前阶段的订单
    getOrder = () => {
        queryOrderByStatus(['1', JSON.parse(localStorage.getItem('user')).uid])
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.data)
                    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                        this.setState({
                            data: res.data.data.map(item => ({
                                ...item,
                                time: format(new Date(item.time), 'yyyy-MM-dd'),
                                lasttime: format(new Date(item.lasttime), 'yyyy-MM-dd'),
                                key: item.id
                            }))
                        })
                    }

                }
            })
    }
    handleClickDis = (id) => {
        queryEmpByRole(['3', JSON.parse(localStorage.getItem('user')).uid])
            .then(async res => {
                if (res.data.success) {
                    let emp = res.data.data
                    let _emp = emp
                    await _emp.map(async (item, index) => {
                        await queryOrderByStatus(['2', item.id])
                            .then(res => {
                                if (res.data.success) {
                                    emp[index] = {
                                        ...emp[index],
                                        key: emp[index].id,
                                        num: res.data.data.length
                                    }
                                    this.setState({ emp })
                                } else {
                                    emp[index] = {
                                        ...emp[index],
                                        key: emp[index].id,
                                        num: 0
                                    }
                                    this.setState({ emp })
                                }
                            })
                            .catch(err => console.log(err))
                    })
                    this.setState({
                        id,
                        visible: true,
                    })
                }
            })


    }

    handleOk = (e) => {
        const { empId, id } = this.state
        addOrderStatus({
            status_id: +new Date(),
            order_id: id,
            status: '2',
            status_time: moment().format('YYYY-MM-DD hh:mm:ss'),
            emp_id: empId,
        })
            .then(res => {
                if (res.data.success) {
                    this.getOrder()
                }
            })
        this.setState({
            visible: false,
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    handleChange = (value) => {
        this.setState({
            empId: value
        })
    }
    render() {
        const { data, visible, emp } = this.state
        const columns = [
            { title: '单号', dataIndex: 'id', key: 'id', },
            { title: '详情', dataIndex: 'information', key: 'information', },
            { title: '车牌', dataIndex: 'plate', key: 'plate', },
            { title: '时间', dataIndex: 'time', key: 'time', },
            { title: '公里数（单位：公里）', dataIndex: 'mileage', key: 'mileage', },
            { title: '上次保养时间', dataIndex: 'lasttime', key: 'lasttime', },
            { title: '操作', key: 'action', render: (text, record) => <Button onClick={() => this.handleClickDis(record.id)}>分配维修</Button> }
        ]
        let _nums = []
        emp.map(item => {
            console.log(item.key);
            _nums.push(item.num)
            return item
        })
        let recommended = emp.filter(item => item.num - 0 === Math.min(..._nums) - 0)[0] || {}
        console.log(recommended)
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="未分配订单" bordered={false} >
                    <Table columns={columns} dataSource={data} />
                </Card>
                <Modal
                    title="选择工程师"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Select style={{ width: 120 }} onChange={this.handleChange}>
                        {
                            emp.map(item => (
                                <Option value={item.id} key={item.id}>{item.username}</Option>
                            ))
                        }
                    </Select>
                    <span style={{ marginLeft: '10px' }}>推荐工程师：{recommended && recommended.username}</span>
                </Modal>
            </div>
        );
    }
}

export default Consultant;
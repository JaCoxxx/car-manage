import React, { Component } from 'react'
import { queryOrderByStatus, } from '../../../axios'
import { Table, Card, message, Radio, Button } from 'antd'
import { format } from '../../../utils'
import PerfectOrder from '../PerfectOrder'

class Perfect extends Component {
    state = {
        data: [],
        loading: false,
        visible: false,
        id: '',
    }
    componentDidMount() {
        this.getOrder()
    }
    // 获取当前阶段的订单
    getOrder = () => {
        queryOrderByStatus(['0', JSON.parse(localStorage.getItem('user')).uid])
            .then(res => {
                if (res.data.success) {
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
    start = async () => {
        this.setState({ loading: true })
        await this.getOrder()
        this.setState({ loading: false })
    }

    // 完善订单
    hanleClickShowDetails = (id) => {
        this.setState({ id }, () => this.showModal())
    }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            id: '',
        })
    }

    render() {
        const { data, visible, id, loading } = this.state
        const columns = [
            { title: '单号', dataIndex: 'id', key: 'id', },
            { title: '详情', dataIndex: 'information', key: 'information', },
            { title: '车牌', dataIndex: 'plate', key: 'plate', },
            { title: '时间', dataIndex: 'time', key: 'time', },
            {
                title: '操作', key: 'action', render: (text, record) => (
                    <Radio.Group>
                        <Radio.Button onClick={() => this.hanleClickShowDetails(record.id)}>完善订单</Radio.Button>
                    </Radio.Group>
                )
            }
        ]
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="待完善订单" bordered={false} >
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" onClick={this.start}
                            disabled={loading} loading={loading}
                        >刷新</Button>
                    </div>
                    <Table columns={columns} dataSource={data} />
                </Card>
                {id ? <PerfectOrder hiddenModal={this.handleCancel} handleCancel={this.handleCancel} visible={visible} id={id} /> : null}
            </div>
        );
    }
}

export default Perfect
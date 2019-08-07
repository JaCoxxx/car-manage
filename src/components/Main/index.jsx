import React, { Component } from 'react';
import { Row, Col, Card, Timeline, Icon, Avatar } from 'antd'
import { queryOrderNum, queryOwnerNum, queryNumByStatus, queryFeedback } from '../../axios'

class Main extends Component {
    state = {
        ownerNum: 0,
        orderNum: 0,
        feedback: [],
        statusNum: [],
    }
    componentWillMount() {
        const orderStatus = [
            '待分配', '正在分配中', '正在维修中',
            '正在核对金额', '等待客户付款', '交易完成', '交易取消',
        ]
        queryOrderNum()
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        orderNum: res.data.data[0]['count(1)']
                    })
                }
            })
        queryOwnerNum()
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        ownerNum: res.data.data[0]['count(1)']
                    })
                }
            })
        queryNumByStatus()
            .then(res => {
                if (res.data.success) {
                    let _arr = []
                    let _statusNum = []
                    res.data.data.map(item => {
                        let _status = item.status - 0
                        let _num = item['count(1)']
                        _arr.push({
                            [_status]: _num
                        })
                        return item
                    })
                    _arr.map(item => {
                        let _key = Object.keys(item)[0]
                        let _num = _key - 0 === 5 ? item[_key] : item[_key] - _arr[_key - 0 + 1][_key - 0 + 1]
                        _statusNum.push(`${orderStatus[_key - 0]}:${_num}项订单`)
                        return item
                    })
                    this.setState({
                        statusNum: _statusNum
                    })
                }
            })
        queryFeedback()
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        feedback: res.data.data
                    })
                }
            })
    }
    render() {
        const { orderNum, ownerNum, statusNum, feedback } = this.state
        return (
            <div>
                <Row gutter={10}>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="user" className="text-2x" />
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">总注册用户</div>
                                        <h2>{ownerNum}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </Col>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="profile" className="text-2x" />
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">总订单量</div>
                                        <h2>{orderNum}</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="pb-m">
                                    <h3>订单</h3>
                                    <small>所有订单进度</small>
                                </div>
                                <Timeline>
                                    {
                                        statusNum.map((item, index) => (
                                            <Timeline.Item key={index}>{item}</Timeline.Item>
                                        ))
                                    }
                                </Timeline>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="pb-m">
                                    <h3>反馈</h3>
                                    <small>用户反馈</small>
                                </div>
                                <ul className="list-group no-border">
                                    {
                                        feedback.map((item, index) => (
                                            <li className="list-group-item" key={index}>
                                                <span className="pull-left w-40 mr-m">
                                                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{item.name && item.name.slice(0, 1)}</Avatar>
                                                </span>
                                                <div className="clear">
                                                    <span className="block">{item.name}</span>
                                                    <span className="text-muted">{item.content}</span>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Main;
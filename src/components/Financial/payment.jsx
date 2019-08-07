import React, { Component } from 'react'
import { queryOrderByStatus, queryOrderById, addOrderStatus } from '../../axios'
import { Button, Table, Card, Modal, List, message, InputNumber, Icon, Input } from 'antd'
import { format } from '../../utils'
import OrderDetails from '../Order/OrderDetails'
import moment from 'moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Highlighter from 'react-highlight-words'

class Payment extends Component {
    state = {
        data: [],
        visible: false,
        id: '',
        partData: [],
        price: 0,
        paid_in: 0,
        billDispenser: 0,
        searchText: '',
    }
    componentDidMount() {
        this.getOrder()
    }
    // 获取当前阶段的订单
    getOrder = () => {
        queryOrderByStatus(['4', JSON.parse(localStorage.getItem('user')).uid])
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.data);
                    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                        this.setState({
                            data: res.data.data.map(item => ({
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
        console.log(id)
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

    onChange = (value) => {
        this.setState({
            paid_in: value - 0,
        }, () => {
            this.setState({
                billDispenser: this.state.paid_in - this.state.price
            })
        })
    }

    handleOk = () => {
        const { id, billDispenser, paid_in } = this.state
        if(billDispenser >= 0 && paid_in !== 0) {
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
        } else {
            message.warning('请输入正确的金额')
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
            </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
            </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
    render() {
        const { data, visible, price, billDispenser } = this.state
        const { order } = this.props
        const ordersTatus = order.orderStatus
        const columns = [
            { title: '单号', dataIndex: 'id', key: 'id', ...this.getColumnSearchProps('id') },
            { title: '详情', dataIndex: 'information', key: 'information', ...this.getColumnSearchProps('information') },
            { title: '车牌', dataIndex: 'plate', key: 'plate', ...this.getColumnSearchProps('plate') },
            { title: '时间', dataIndex: 'time', key: 'time', ...this.getColumnSearchProps('time') },
            { title: '操作', key: 'action', render: (text, record) => <Button onClick={() => this.handleClickDis(record.id)}>账单结算</Button> }
        ]
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="待结算订单" bordered={false} >
                    <Table columns={columns} dataSource={data} expandedRowRender={(e) => OrderDetails(e, ordersTatus)} />
                </Card>
                <Modal
                    title="结算"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        loading={false}
                    >
                        <List.Item>
                            <List.Item.Meta
                                style={{ width: '200px' }}
                                title='应收'
                            />
                            <div style={{ padding: '0 60px', textAlign: 'center' }}>{price}</div>
                        </List.Item>
                        <List.Item>
                            <List.Item.Meta
                                style={{ width: '200px' }}
                                title='实收'
                            />
                            <div style={{ padding: '0 60px', textAlign: 'center' }}>
                                <InputNumber defaultValue={0} onChange={this.onChange} />
                            </div>
                        </List.Item>
                        <List.Item>
                            <List.Item.Meta
                                style={{ width: '200px' }}
                                title='找零'
                            />
                            <div style={{ padding: '0 60px', textAlign: 'center' }}>{billDispenser}</div>
                        </List.Item>
                    </List>
                </Modal>
            </div>
        );
    }
}

Payment.propTypes = {
    order: PropTypes.object,
}

const mapStateToProps = ({ Order }) => {
    return {
        order: Order,
    }
}

export default connect(mapStateToProps)(Payment)
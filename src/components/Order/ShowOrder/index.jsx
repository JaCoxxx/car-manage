import React, { Component } from 'react'
import {
    Table, Row, Col, Card, Radio, Input, Button, Icon,
} from 'antd'
import Highlighter from 'react-highlight-words'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addOrder, setOrder } from '../../../reducer/actions'
import { getOrderByAdmin } from '../../../reducer/order'
import OrderDetails from '../OrderDetails'
import PerfectOrder from '../PerfectOrder'

class ShowOrder extends Component {
    state = {
        visible: false,
        searchText: '',
        id: '',
    }

    componentDidMount() {
        const { getOrder } = this.props
        getOrder()
    }

    // 列搜索功能函数
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
        render: (text = '') => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    // 搜索确定
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    // 搜索重置
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
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
        const { visible, id } = this.state
        const { order } = this.props
        const ordersTatus = order.orderStatus
        const { order: orders, orderColumns } = order
        const columns = orderColumns
            .map(item => ({
                ...item,
                ...this.getColumnSearchProps(item.dataIndex || item.key)
            }))
            // .concat({
            //     title: '操作',
            //     dataIndex: '',
            //     key: 'x',
            //     render: (text, record) => (
            //         <Radio.Group>
            //             <Radio.Button onClick={() => this.hanleClickShowDetails(record.id)}>完善订单</Radio.Button>
            //         </Radio.Group>
            //     ),
            // })
        const title = '所有订单'
        return (
            <div className="gutter-example">
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title={title || ''} bordered={false}>
                                <Table
                                    className="components-table-demo-nested"
                                    columns={columns}
                                    dataSource={orders}
                                    expandedRowRender={(e) => OrderDetails(e, ordersTatus)}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                {id ? <PerfectOrder hiddenModal={this.handleCancel} handleCancel={this.handleCancel} visible={visible} id={id} /> : null}
            </div>

        );
    }
}

ShowOrder.propTypes = {
    order: PropTypes.object,
    addOrder: PropTypes.func,
    setOrder: PropTypes.func,
    getOrder: PropTypes.func
}

const mapStateToProps = ({ Order }) => {
    return {
        order: Order,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addOrder(order) {
            dispatch(addOrder(order))
        },
        setOrder(id, order) {
            dispatch(setOrder(id, order))
        },
        getOrder() {
            return getOrderByAdmin()(dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowOrder)
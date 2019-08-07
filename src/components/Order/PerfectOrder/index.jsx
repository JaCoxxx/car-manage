import React, { Component } from 'react'
import {
    Form, Input, DatePicker, InputNumber, Modal, message,
} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setOrder } from '../../../reducer/actions'
import { addOrderStatus } from '../../../axios'

class PerfectOrder extends Component {
    state = {
        confirmLoading: false,
        order: {},
        date: '',
    }

    componentDidMount() {
        const { order, id } = this.props
        const { setFieldsValue } = this.props.form
        const data = order.order.find(item => item.id === id)
        this.setState({
            order: data
        }, () => {
            setFieldsValue({
                'information': this.state.order.information || '',
                'lasttime': moment(data.lasttime, 'YYYY-MM-DD') || '2010-01-01',
                'mileage': this.state.order.mileage || 0,
            })
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { setOrder, hiddenModal } = this.props
        const { order, date } = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading: true
                })
                setOrder(order.id, {
                    information: values.information,
                    lasttime: date,
                    mileage: values.mileage + ''
                })
                // status_id=?,order_id=?,status=?,status_time=?,emp_id=?
                console.log(moment().format('L'))
                addOrderStatus({
                    status_id: +new Date(),
                    order_id: order.id,
                    status: '1',
                    status_time: moment().format('YYYY-MM-DD hh:mm:ss'),
                    emp_id: '10003',
                })
                .then(res => {
                    if(res.data.success) {
                        message.success('已移至维修顾问处，等待分配')
                    } else {
                        message.warning('订单已分配过，请勿重复修改')
                    }
                })
                .catch(err => console.log(err))
                hiddenModal()
            }
        });
    }

    // 日期发生更改
    onChangeDate = (date, dateString) => {
        this.setState({
            date: dateString
        }, () => console.log(this.state.date))

    }

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        })
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            })
        }, 2000)
    }


    render() {
        const { confirmLoading } = this.state
        const { visible, handleCancel } = this.props
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="完善订单"
                visible={visible}
                onOk={this.handleSubmit}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Form className="login-form">
                    <Form.Item label='订单详情'>
                        {getFieldDecorator('information', {
                            rules: [{ required: true, message: '请输入详情!' }],
                        })(
                            <Input placeholder="例如：我想修一下左边的前轮，它有些漏气了。" />
                        )}
                    </Form.Item>
                    <Form.Item label='上次保养时间'>
                        {getFieldDecorator('lasttime', {
                            rules: [{ required: true, message: '请输入上次保养的时间!' }],
                        })(
                            <DatePicker onChange={this.onChangeDate} format="YYYY-MM-DD" />
                        )}
                    </Form.Item>
                    <Form.Item label='汽车行驶公里数（单位：KM）'>
                        {getFieldDecorator('mileage', {
                            rules: [{ required: true, message: '请输入公里数!' }],
                        })(
                            <InputNumber />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

PerfectOrder.propTypes = {
    order: PropTypes.object,
    setOrder: PropTypes.func,
}

const mapStateToProps = ({ Order }) => {
    return {
        order: Order,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder(id, order) {
            dispatch(setOrder(id, order))
        },
    }
}

export default Form.create({ name: 'perfect_order' })(connect(mapStateToProps, mapDispatchToProps)(PerfectOrder))
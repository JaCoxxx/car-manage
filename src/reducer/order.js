import { queryAllOrder, updateOrderInfo } from '../axios'
import { getOrder } from './actions'
import { format } from '../utils'
import { message } from 'antd'

const initialOrder = {
    order: [],
    orderColumns: [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '车牌',
            dataIndex: 'plate',
            key: 'plate',
        },
        {
            title: '生成时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '当前进度',
            dataIndex: 'state',
            key: 'state',
        },
    ],
    orderStatus: [
        '待分配', '正在分配中', '正在维修中',
        '正在核对金额', '等待客户付款', '交易完成', '交易取消',
    ],
}

export const Order = (state = initialOrder, action) => {
    switch (action.type) {
        case 'ADD_ORDER':
            return {
                ...state,
                order: [...state.order, action.order]
            }
        case 'SET_ORDER':
            const order = state.order.map(item => {
                if (item.id === action.id) {
                    return {
                        ...item,
                        ...action.order
                    }
                }
                return item
            })
            const newOrder = order.filter(item => item.id === action.id)[0]
            updateOrderInfo({
                information: newOrder.information,
                lasttime: newOrder.lasttime,
                mileage: newOrder.mileage,
                id: action.id,
            })
                .then(res => {
                    message.success('修改成功')
                })
            return {
                ...state,
                order
            }
        case 'GET_ORDER':
            return {
                ...state,
                order: action.order
            }
        default:
            return state
    }
}

export const getOrderByAdmin = () => {
    return dispatch => {
        queryAllOrder()
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data.map(item => {
                        return {
                            ...item,
                            time: format(new Date(item.time), 'yyyy-MM-dd'),
                            key: item.id
                        }
                    })
                    dispatch(getOrder(data))
                    return true
                } else {
                    return res
                }
            })
            .catch(err => err)
    }
}
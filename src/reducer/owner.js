import { queryAllOwner, userReg, updateUserInfo, delOwner } from '../axios'
import { message } from 'antd'
import { getOwner, addOwner } from './actions'
import { format } from '../utils'

const initialOwner = {
    owner: [],
    ownerColumns: [
        {
            title: '姓名',
            dataIndex: 'username',
            key: 'username',
            editable: true,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            editable: true,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            editable: true,
        },
        {
            title: '车辆型号',
            dataIndex: 'model',
            key: 'model',
            editable: true,
        },
        {
            title: '车牌',
            dataIndex: 'plate',
            key: 'plate',
            editable: true,
        },
        {
            title: '购车日期',
            dataIndex: 'car_date',
            key: 'car_date',
            editable: true,
        },
    ],
}

export const Owner = (state = initialOwner, action) => {
    switch (action.type) {
        case 'ADD_OWNER':
            return {
                ...state,
                owner: [...state.owner, action.owner]
            }
        case 'SET_OWNER':
            const owner = state.owner.map(item => {
                if (item.id === action.id) {
                    return {
                        ...item,
                        ...action.owner
                    }
                }
                return item
            })
            const newOwn = owner.filter(item => item.id === action.id)[0]
            updateUserInfo({
                username: newOwn.username,
                sex: newOwn.sex || '男',
                phone: newOwn.phone,
                email: newOwn.email,
                model: newOwn.model,
                plate: newOwn.plate,
                car_date: newOwn.car_date || '2000-01-01',
                note: newOwn.note,
                id: action.id,
            })
                .then(res => {
                    message.success('修改成功')
                })
            return {
                ...state,
                owner
            }
        case 'DEL_OWNER':
            let _arr = state.owner
            delOwner(action.id)
                .then(res => {
                    if(res.data.success) {
                        message.success('删除成功')
                        _arr = state.owner.filter(item => item.id !== action.id)
                    } else {
                        message.warning('当前该用户有订单存在，无法删除')
                    }
                })
                .catch(err => {
                    message.warning(err)
                })
                return {
                    ...state,
                    owner: _arr
                }
        case 'GET_OWNER':
            return {
                ...state,
                owner: action.owner
            }
        default:
            return state
    }
}

export const getAllOwner = () => {
    return dispatch => {
        queryAllOwner()
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data.map(item => {
                        return {
                            ...item,
                            car_date: format(new Date(item.car_date), 'yyyy-MM-dd'),
                            key: item.id
                        }
                    })
                    dispatch(getOwner(data))
                    return true
                } else {
                    return res
                }
            })
            .catch(err => err)
    }
}

export const addOwnerByAdmin = params => {
    return async dispatch => {
        return await userReg(params)
            .then(res => {
                if (res.data.success) {
                    dispatch(addOwner({
                        ...params,
                        key: params.id
                    }))
                }
                return res
            })
            .catch(err => err)
    }
}
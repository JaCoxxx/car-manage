import { queryAllEmp, empReg, updateEmpInfo, delEmp } from '../axios'
import { getEmployees, addEmployees } from './actions'
import { message } from 'antd'

const initialEmployees = {
    employees: [],
    employeesColumns: [
        {
            title: '工号',
            dataIndex: 'id',
            key: 'id',
            editable: false,
        },
        {
            title: '姓名',
            dataIndex: 'username',
            key: 'username',
            editable: true,
        },
        {
            title: '职务',
            dataIndex: 'position',
            key: 'position',
            editable: true,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            editable: true,
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            editable: true,
        },
    ]
}

export const Employees = (state = initialEmployees, action) => {
    switch (action.type) {
        case 'ADD_EMPLOYEES':
            return {
                ...state,
                employees: [...state.employees, action.employees]
            }
        case 'SET_EMPLOYEES':
            const employees = state.employees.map(item => {
                if (item.id === action.id) {
                    return {
                        ...item,
                        ...action.employees
                    }
                }
                return item
            })
            const newEmp = employees.filter(item => item.id === action.id)[0]
            updateEmpInfo({
                username: newEmp.username,
                position: newEmp.position,
                phone: newEmp.phone,
                sex: newEmp.sex,
                role: newEmp.role,
                id: action.id,
            })
                .then(res => {
                    message.success('修改成功')
                })
            return {
                ...state,
                employees
            }
        case 'DEL_EMPLOYEES':
            delEmp(action.id)
                .then(res => {
                    if(res.data.success) {
                        message.success('删除成功')
                    } else {
                        message.warning(res.data.message)
                    }
                })
                .catch(err => message.warning(err))
            return {
                ...state,
                employees: state.employees.filter(item => item.id !== action.id)
            }
        case 'GET_EMPLOYEES':
            return {
                ...state,
                employees: action.employees
            }
        default:
            return state
    }
}

export const getAllEmp = () => {
    return dispatch => {
        queryAllEmp()
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data.map(item => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })
                    dispatch(getEmployees(data))
                    return true
                } else {
                    return res
                }
            })
            .catch(err => err)
    }
}

export const addEmpByAdmin = params => {
    console.log(params)
    return async dispatch => {
        return await empReg(params)
            .then(res => {
                console.log(res)
                if (res.data.success) {
                    dispatch(addEmployees({
                        ...params,
                        key: params.id
                    }))
                }
                return res
            })
            .catch(err => err)
    }
}
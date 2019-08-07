import axios from 'axios'
import { useUrl, empUrl, orderUrl, adminUrl } from './config'

export const userLogin = (params) => {
    return axios.post(useUrl('login'), { params: { ...params } })
}

export const userReg = (params) => {
    return axios.post(useUrl('register'), { params: { ...params } })
}

export const userLoginout = () => {
    return axios.get(useUrl('loginout'))
}

export const userCheckLogin = () => {
    return axios.get(useUrl('check'))
}

export const queryUserByPhone = (params) => {
    return axios.get(useUrl('queryuser'), { params })
}

export const queryUserById = (params) => {
    return axios.get(useUrl('queryuserid'), { params })
}

export const queryAllOwner = () => {
    return axios.get(useUrl('queryall'))
}

export const updateUserInfo = (params) => {
    return axios.post(useUrl('update'), { params: { ...params } })
}

export const changeUserPwd = async (params) => {
    return await userLogin({
        name: params.username,
        password: params.password
    })
        .then(res => {
            console.log(res)
            if (res.data.success) {
                return axios.post(useUrl('changepwd'), {
                    params: {
                        password: params.rpassword,
                        phone: params.username,
                    }
                })
            } else {
                return res
            }
        })
        .catch(err => err)

}

export const delOwner = (params) => {
    return axios.get(useUrl('delowner'), { params })
}

export const queryOrderByOwner = (params) => {
    return axios.get(orderUrl('orderow'), { params })
}

export const empLogin = (params) => {
    return axios.post(empUrl('login'), { params: { ...params } })
}

export const empReg = (params) => {
    return axios.post(empUrl('register'), { params: { ...params } })
}

export const queryAllEmp = () => {
    return axios.get(empUrl('queryall'))
}

export const updateEmpInfo = (params) => {
    return axios.post(empUrl('update'), { params: { ...params } })
}

export const delEmp = (params) => {
    return axios.get(empUrl('delemp'), { params })
}

export const queryEmpByRole = (params) => {
    return axios.get(empUrl('queryrole'), { params })
}

export const queryEmpById = (params) => {
    return axios.get(empUrl('queryemp'), { params })
}

export const changeEmpPwd = async (params) => {
    return await empLogin({
        userName: params.username,
        password: params.password
    })
        .then(res => {
            console.log(res)
            if (res.data.success) {
                return axios.post(empUrl('changepwd'), {
                    params: {
                        password: params.rpassword,
                        id: params.username,
                    }
                })
            } else {
                return res
            }
        })
        .catch(err => err)
}

export const addOrder = (params) => {
    return axios.post(orderUrl('add'), { params: { ...params } })
}

export const queryAllOrder = () => {
    return axios.get(orderUrl('queryall'))
}

export const queryOrderPart = (params) => {
    return axios.get(orderUrl('querypart'), { params })
}

export const queryOrderStatus = (params) => {
    return axios.get(orderUrl('querystatus'), { params })
}

export const updateOrderInfo = (params) => {
    return axios.post(orderUrl('updateinfo'), { params: { ...params } })
}

export const queryOrderByStatus = (params) => {
    return axios.get(orderUrl('querybystatus'), { params })
}

export const addOrderStatus = async (params) => {
    return axios.post(orderUrl('addstatus'), { params: { ...params } })
}

export const queryPartById = (params) => {
    return axios.get(orderUrl('part'), { params })
}

export const queryOrderById = (params) => {
    return axios.get(orderUrl('orderbyid'), { params })
}

export const addPartById = (params) => {
    return axios.post(orderUrl('addpart'), { params: { ...params } })
}

export const addOrderPrice = (params) => {
    return axios.post(orderUrl('addprice'), { params: { ...params } })
}

export const updatePartById = (params) => {
    return axios.post(orderUrl('updatepart'), { params: { ...params } })
}

export const delPartById = (params) => {
    return axios.get(orderUrl('delpart'), { params })
}

export const queryOrderByEmp = (params) => {
    return axios.get(orderUrl('querybyemp'), { params })
}

export const queryOrderNum = () => {
    return axios.get(adminUrl('ordernum'))
}

export const queryOwnerNum = () => {
    return axios.get(adminUrl('ownernum'))
}

export const queryNumByStatus = () => {
    return axios.get(adminUrl('statusnum'))
}

export const addFeedback = (params) => {
    return axios.post(adminUrl('addfeed'), { params: { ...params } })
}

export const queryFeedback = () => {
    return axios.get(adminUrl('feedback'))
}
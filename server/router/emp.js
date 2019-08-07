/**
 * 员工请求路由
 */
const { findEmpById, insertEmp, findAllEmp, updateEmpById, delEmpById, findEmpByRole, updateEmpPwdById, } = require('../db/index')
const { successResponse, failedResponse, getPwd, getRole } = require('../utils')

const empLogin = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        await findEmpById([requestData.params.userName])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    if (res[0].password === getPwd(requestData.params.password)) {
                        ctx.body = successResponse({ data: { ...res[0], password: '' } })
                    } else {
                        ctx.body = failedResponse({ message: '用户名或密码错误' })
                    }
                } else {
                    ctx.body = failedResponse({ message: '用户名或密码错误' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}
const empRegister = async (ctx, next) => {
    try {
        const { id, username, password, position, phone, sex } = ctx.request.body.params
        await insertEmp([id, username, getPwd(password), position, phone, sex, getRole(position)])
            .then(res => {
                if (res.protocol41) {
                    ctx.body = successResponse({ message: '注册成功' })
                } else {
                    ctx.body = failedResponse({ message: '注册失败' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryAllEmp = async (ctx, next) => {
    try {
        await findAllEmp()
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = failedResponse({ message: '未找到？' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const updateEmpInfo = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await updateEmpById(data)
            .then(res => {
                if (res.protocol41) {
                    ctx.body = successResponse({ data: '更新成功' })
                } else {
                    ctx.body = failedResponse({ message: '更新失败' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (err) {
        ctx.body = failedResponse({ message: err })
        throw (err)
    }
}

const delEmp = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await delEmpById([requestData['0']])
            .then(res => {
                if (res.protocol41) {
                    ctx.body = successResponse({ data: '删除成功' })
                } else {
                    ctx.body = failedResponse({ message: '删除失败' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryEmpByRole = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findEmpByRole([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = failedResponse({ message: '未找到？' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryEmpById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findEmpById([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = failedResponse({ message: '未找到？' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const updateEmpPwd = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            if (i === 'password') {
                data.push(getPwd(requestData.params[i]))
            } else {
                data.push(requestData.params[i])
            }
        }
        await updateEmpPwdById(data)
            .then(res => {
                if (res.protocol41) {
                    ctx.body = successResponse({ data: '修改成功' })
                } else {
                    ctx.body = failedResponse({ message: '修改失败' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

module.exports = {
    empLogin,
    empRegister,
    queryAllEmp,
    updateEmpInfo,
    delEmp,
    queryEmpByRole,
    queryEmpById,
    updateEmpPwd,
}
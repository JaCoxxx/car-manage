/**
 * 
 * 用户请求路由
 * 
 */

const { findOwnerByPhone, insertOwner, updateOwnerById, findAllOwner, delOwnerById, findOwnerById, updateOwnerPwdByPhone, } = require('../db/index')
const { successResponse, failedResponse, checkLogin, getPwd } = require('../utils')

const userLogin = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        await checkLogin(ctx) ? ctx.body = failedResponse({ message: '已经登录过了' }) :
            await findOwnerByPhone([requestData.params.name])
                .then(res => {
                    if (Array.isArray(res) && res.length > 0) {
                        if (res[0].password === getPwd(requestData.params.password)) {
                            ctx.session = {
                                user: res[0].username,
                                id: res[0].id,
                                phone: res[0].phone
                            }
                            ctx.body = successResponse({ data: res[0].username })
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

const userRegister = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        const pwd = getPwd(requestData.params.password)
        let data = []
        for (let i in requestData.params) {
            if (i === 'password') {
                data.push(pwd)
            } else {
                data.push(requestData.params[i])
            }
        }
        await findOwnerByPhone([requestData.params.phone])
            .then(async (res) => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = failedResponse({ message: '帐号已存在，请选择登录或更换帐号注册' })
                } else {
                    await insertOwner(data)
                        .then(res => {
                            if (res.protocol41) {
                                ctx.body = successResponse({ data: '注册成功' })
                            } else {
                                ctx.body = failedResponse({ message: '注册失败' })
                            }
                        })
                        .catch(err => ctx.body = failedResponse({ message: err }))
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))

    } catch (err) {
        ctx.body = failedResponse({ message: err })
        throw (err)
    }
}

const queryUserByPhone = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOwnerByPhone([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res[0] })
                } else {
                    ctx.body = failedResponse({ message: '未找到？' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (err) {
        ctx.body = failedResponse({ message: err })
        throw (err)
    }
}

const userLoginout = (ctx, next) => {
    try {
        ctx.session = null
        ctx.body = successResponse({ message: '成功' })
    } catch (err) {
        ctx.body = failedResponse({ message: err })
        throw (err)
    }
}

const userCheckLogin = (ctx, next) => {
    try {
        ctx.body = successResponse({ data: checkLogin(ctx) })
    } catch (err) {
        ctx.body = failedResponse({ message: err })
        throw (err)
    }
}

const updateUserInfo = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await updateOwnerById(data)
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

const queryAllOwner = async (ctx, next) => {
    try {
        await findAllOwner()
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

const delOwnById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await delOwnerById([requestData['0']])
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

const queryUserById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOwnerById([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = failedResponse({ message: '未找到？' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (err) {
        ctx.body = failedResponse({ message: err })
        throw (err)
    }
}

const changeUserPwd = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            if(i === 'password') {
                data.push(getPwd(requestData.params[i]))
            } else {
                data.push(requestData.params[i])
            }
        }
        await updateOwnerPwdByPhone(data)
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
    userLogin,
    userRegister,
    userLoginout,
    userCheckLogin,
    queryUserByPhone,
    updateUserInfo,
    queryAllOwner,
    delOwnById,
    queryUserById,
    changeUserPwd,
}
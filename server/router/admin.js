/**
 * 员工请求路由
 */
const { findOrderNum, findOwnerNum, findNumByStatus, insertFeedback, findFeedback } = require('../db/index')
const { successResponse, failedResponse, } = require('../utils')

const queryOrderNum = async (ctx, next) => {
    try {
        await findOrderNum()
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

const queryOwnerNum = async (ctx, next) => {
    try {
        await findOwnerNum()
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

const queryNumByStatus = async (ctx, next) => {
    try {
        await findNumByStatus()
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

const queryFeedback = async (ctx, next) => {
    try {
        await findFeedback()
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

const addFeedback = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await insertFeedback(data)
            .then(res => {
                if (res.protocol41) {
                    ctx.body = successResponse({ data: '添加成功' })
                } else {
                    ctx.body = failedResponse({ message: '添加失败' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

module.exports = {
    queryOrderNum,
    queryOwnerNum,
    queryNumByStatus,
    queryFeedback,
    addFeedback,
}
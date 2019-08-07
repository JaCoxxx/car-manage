/**
 * 订单请求路由
 */
const {
    findOrderByOwner, insertOrder, findAllBasicOrder, findOrderPartById,
    findOrderStatusById, updateOrderById, findOrderByStatus, insertOrderStatus,
    insertOrderPart, updateOrderPriceById, findOrderPrice, findOrderByEmp,
    findOrderByStatusId, setOrderDone, updateOrderPart, delOrderPart,
} = require('../db/index')
const { successResponse, failedResponse, getPwd, format } = require('../utils')

const queryOrderByOwner = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOrderByOwner([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = successResponse({ data: [] })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const addOrder = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        const id = getPwd(+new Date() + 'order' + +new Date())
        await insertOrder([id, ...data], [+new Date(), id, format(new Date(), 'yyyy-MM-dd hh:mm:ss'), '10001'])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res[0] })
                } else {
                    ctx.body = successResponse({ data: [] })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryAllOrder = async (ctx, next) => {
    try {
        await findAllBasicOrder()
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

const queryOrderPartById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOrderPartById([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = successResponse({ message: '未找到数据' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryOrderStatusById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOrderStatusById([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = successResponse({ message: '未找到数据' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const updateOrderInfo = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await updateOrderById(data)
            .then(res => {
                if (res.protocol41) {
                    ctx.body = successResponse({ data: '更新成功' })
                } else {
                    ctx.body = failedResponse({ message: '更新失败' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryOrderByStatus = async (ctx, next) => {
    try {
        const requestData = ctx.query
        let data = []
        await findOrderByStatus([requestData['0'] - 0 + 1 + ''])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    data = res
                }
            })
        await findOrderByStatus([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    let _data = res.map(item => {
                        if (data.some(val => val.id === item.id)) {
                            return null
                        } else {
                            return item
                        }
                    })
                    _data = _data.filter(item => item !== null)
                    _data = _data.filter(item => item.emp_id === requestData['1'])
                    ctx.body = successResponse({ data: _data })
                } else {
                    ctx.body = successResponse({ message: '未找到数据' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const addOrderStatus = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await findOrderByStatusId([requestData.params.status, requestData.params.order_id])
            .then(async res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = failedResponse({ message: '已存在' })
                } else {
                    await insertOrderStatus(data)
                        .then(res => {
                            if (res.protocol41) {
                                ctx.body = successResponse({ data: '添加成功' })
                            } else {
                                ctx.body = failedResponse({ message: '添加失败' })
                            }
                        })
                        .catch(err => ctx.body = failedResponse({ message: err }))
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryPartById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOrderPartById([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = successResponse({ message: '未找到数据' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const addOrderPart = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await findOrderPartById([requestData.params.order_id])
            .then(async res => {
                if (Array.isArray(res) && res.length > 0) {
                    if (res.some(item => item.name === requestData.params.name)) {
                        ctx.body = failedResponse({ message: '该项目已存在，请重新添加' })
                    } else {
                        await insertOrderPart(data)
                            .then(res => {
                                if (res.protocol41) {
                                    ctx.body = successResponse({ data: '添加成功' })
                                } else {
                                    ctx.body = failedResponse({ message: '添加失败' })
                                }
                            })
                            .catch(err => ctx.body = failedResponse({ message: err }))
                    }
                } else {
                    await insertOrderPart(data)
                        .then(res => {
                            if (res.protocol41) {
                                ctx.body = successResponse({ data: '添加成功' })
                            } else {
                                ctx.body = failedResponse({ message: '添加失败' })
                            }
                        })
                        .catch(err => ctx.body = failedResponse({ message: err }))
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))

    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const addOrderPrice = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await updateOrderPriceById(data)
            .then(async res => {
                if (res.protocol41) {
                    await setOrderDone([requestData.params.id])
                    .then(res => {
                        if (res.protocol41) {
                            ctx.body = successResponse({ data: '添加成功' })
                        } else {
                            ctx.body = failedResponse({ message: '添加失败' })
                        }
                    })
                    .catch(err => ctx.body = failedResponse({ message: err }))
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

const queryOrderById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOrderPrice([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = successResponse({ message: '未找到数据' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const queryOrderByEmp = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await findOrderByEmp([requestData['0']])
            .then(res => {
                if (Array.isArray(res) && res.length > 0) {
                    ctx.body = successResponse({ data: res })
                } else {
                    ctx.body = successResponse({ message: '未找到数据' })
                }
            })
            .catch(err => ctx.body = failedResponse({ message: err }))
    } catch (error) {
        ctx.body = failedResponse({ message: error })
        throw (error)
    }
}

const updateOrderPartById = async (ctx, next) => {
    try {
        const requestData = ctx.request.body
        let data = []
        for (let i in requestData.params) {
            data.push(requestData.params[i])
        }
        await updateOrderPart(data)
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

const delOrderPartById = async (ctx, next) => {
    try {
        const requestData = ctx.query
        await delOrderPart([requestData['0']])
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

module.exports = {
    queryOrderByOwner,
    addOrder,
    queryAllOrder,
    queryOrderPartById,
    queryOrderStatusById,
    updateOrderInfo,
    queryOrderByStatus,
    addOrderStatus,
    queryPartById,
    addOrderPart,
    addOrderPrice,
    queryOrderById,
    queryOrderByEmp,
    updateOrderPartById,
    delOrderPartById,
}
const Router = require('koa-router')
const {
    userLogin, userRegister, userLoginout, userCheckLogin,
    queryUserByPhone, updateUserInfo, queryAllOwner,
    delOwnById, queryUserById, changeUserPwd,
} = require('./user')
const {
    empLogin, empRegister, queryAllEmp, updateEmpInfo,
    delEmp, queryEmpByRole, queryEmpById, updateEmpPwd,
} = require('./emp')
const {
    queryOrderByOwner, addOrder, queryAllOrder, queryOrderPartById,
    queryOrderStatusById, updateOrderInfo, queryOrderByStatus,
    addOrderStatus, queryPartById, addOrderPart, addOrderPrice,
    queryOrderById, queryOrderByEmp, updateOrderPartById, delOrderPartById,
} = require('./order')
const {
    queryOrderNum, queryOwnerNum, queryNumByStatus,
    addFeedback, queryFeedback
} = require('./admin')

// 用户路由配置
const user = new Router()

user.post('/login', userLogin)
user.post('/register', userRegister)
user.get('/loginout', userLoginout)
user.get('/check', userCheckLogin)
user.get('/queryuser', queryUserByPhone)
user.post('/update', updateUserInfo)
user.get('/queryall', queryAllOwner)
user.get('/delowner', delOwnById)
user.get('/queryuserid', queryUserById)
user.post('/changepwd', changeUserPwd)

// 员工路由配置
const emp = new Router()

emp.post('/login', empLogin)
emp.post('/register', empRegister)
emp.get('/queryall', queryAllEmp)
emp.post('/update', updateEmpInfo)
emp.get('/delemp', delEmp)
emp.get('/queryrole', queryEmpByRole)
emp.get('/queryemp', queryEmpById)
emp.post('/changepwd', updateEmpPwd)

// 订单路由配置
const order = new Router()

order.get('/orderow', queryOrderByOwner)
order.post('/add', addOrder)
order.get('/queryall', queryAllOrder)
order.get('/querypart', queryOrderPartById)
order.get('/querystatus', queryOrderStatusById)
order.post('/updateinfo', updateOrderInfo)
order.get('/querybystatus', queryOrderByStatus)
order.post('/addstatus', addOrderStatus)
order.get('/part', queryPartById)
order.post('/addpart', addOrderPart)
order.post('/addprice', addOrderPrice)
order.get('/orderbyid', queryOrderById)
order.get('/querybyemp', queryOrderByEmp)
order.post('/updatepart', updateOrderPartById)
order.get('/delpart', delOrderPartById)

// 网站信息管理路由配置
const admin = new Router()

admin.get('/ownernum', queryOwnerNum)
admin.get('/ordernum', queryOrderNum)
admin.get('/statusnum', queryNumByStatus)
admin.post('/addfeed', addFeedback)
admin.get('/feedback', queryFeedback)

module.exports = {
    user,
    emp,
    order,
    admin,
}
const Koa = require('koa')
const Router = require('koa-router')
const bodyParse = require('koa-bodyparser')
const cors = require('koa2-cors')
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session')
const config = require('./db/config')

const { user, emp, order, admin } = require('./router/index')

const app = new Koa()

const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

app.use(session({
    key: 'USER_SID',
    store: new MysqlSession(sessionMysqlConfig),
    cookie: {
        maxAge: 60*60*1000,
        path: '/user'
    },
}))

const router = new Router()


app.use(bodyParse())
app.use(cors({
    // 允许的域名
    origin: 'http://localhost:3000',
    // 返回的头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    // 有效时间
    maxAge: 300,
    // 允许携带cookie
    credentials: true,
    // 允许的HTTP请求方法
    allowMethods: ['GET', 'POST', 'DELETE'],
    // 允许的头信息字段
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
router.use('/user', user.routes(), user.allowedMethods())
router.use('/emp', emp.routes(), emp.allowedMethods())
router.use('/order', order.routes(), order.allowedMethods())
router.use('/admin', admin.routes(), admin.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())


const server = require('http').createServer(app.callback())
server.listen(3002)

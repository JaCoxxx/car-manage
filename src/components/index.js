/**
 *  路由组件出口文件
 *  
 * */

import Login from './Login'
import Main from './Main'
import NotFound from './NotFound'
import Maintenance from './Maintenance'
import Financial from './Financial'
import Consultant from './Consultant'
import AddUser from './User/AddUser'
import AddEmployees from './User/AddEmployees'
import ShowUser from './User/ShowUser'
import ShowEmployees from './User/ShowEmployees'
import OrderDetails from './Order/OrderDetails'
import ShowOrder from './Order/ShowOrder'
import Message from './Message'
import RouteIntercept from './Widge/RouteIntercept'
import TableTemplate from './Widge/TableTemplate'
import Frontend from './Frontend'
import Payment from './Financial/payment'
import Perfect from './Order/Perfect'

export default {
    Login, Main, NotFound, Maintenance, Financial, Consultant, AddUser,
    AddEmployees, ShowUser, ShowEmployees, OrderDetails, ShowOrder, Message,
    RouteIntercept, TableTemplate, Frontend, Payment, Perfect,
}
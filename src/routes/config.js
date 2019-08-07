/**
 * 
 * roleType
 * 
 * 0: 全部
 * 1: 管理员
 * 2: 访客
 * 3: 维修员工
 * 4: 维修顾问
 * 5: 财务结算员 
 * 
 * */


export default {
    // 菜单路由
    menus: [
        { key: '/app/index', title: '主页', name: 'index', icon: 'home', component: 'RouteIntercept', roleType: 0 },
        // { key: '/app/maintenance', title: '维修页面', name: 'maintenance', icon: 'notification', component: 'Maintenance', roleType: 3 },
        // { key: '/app/consultant', title: '顾问', name: 'consultant', icon: 'tablet', component: 'Consultant', roleType: 4 },
        // { key: '/app/financial', title: '财务', name: 'financial', icon: 'tag', component: 'Financial', roleType: 5 },
        {
            key: '/app/user', title: '用户管理', name: 'user', icon: 'user', roleType: 1,
            subs: [
                { key: '/app/user/add', title: '添加用户', father: '用户管理', name: 'adduser', component: 'AddUser' },
                { key: '/app/user/addemployees', title: '添加员工', father: '用户管理', name: 'addemployees', component: 'AddEmployees' },
                { key: '/app/user/showuser', title: '查看用户', father: '用户管理', name: 'showuser', component: 'ShowUser' },
                { key: '/app/user/showemployees', title: '查看员工', father: '用户管理', name: 'showemployees', component: 'ShowEmployees' },
            ],
        },
        {
            key: '/app/order', title: '订单管理', name: 'order', icon: 'profile', roleType: 1,
            subs: [
                // { key: '/app/order/orderdetails', title: '查看订单详情', father: '订单管理', name: 'orderdetails', component: 'OrderDetails' },
                { key: '/app/order/showorder', title: '查看订单', father: '订单管理', name: 'showorder', component: 'ShowOrder' },
                { key: '/app/order/perfect', title: '待完善订单', father: '订单管理', name: 'perfect', component: 'Perfect'},
            ],
        },
        {
            key: '/app/payment', title: '订单结算', name: 'payment', icon: 'pay-circle', component: 'Payment', roleType: 5,
        }
    ],
    // 其他路由
    others: [
        { key: '/app/message', title: '个人中心', name: 'message', component: 'Message', roleType: 0 },
    ]
}
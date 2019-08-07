// 设置用户名
const SET_USER = 'SET_USER'

// 设置权限
const SET_PERMISSIONS = 'SET_PERMISSIONS'

// 设置响应内容
const SET_ISMOBILE = 'SET_ISMOBILE'

// 设置加载情况，用以消除state的bug
const SET_MOUNTED = 'SET_MOUNTED'

// 新增车主用户
const ADD_OWNER = 'ADD_OWNER'

// 修改用户信息
const SET_OWNER = 'SET_OWNER'

// 删除车主用户
const DEL_OWNER = 'DEL_OWNER'

// 获取所有用户
const GET_OWNER = 'GET_OWNER'

// 获取所有员工
const GET_EMPLOYEES = 'GET_EMPLOYEES'

// 新增员工
const ADD_EMPLOYEES = 'ADD_EMPLOYEES'

// 修改员工信息
const SET_EMPLOYEES = 'SET_EMPLOYEES'

// 删除员工
const DEL_EMPLOYEES = 'DEL_EMPLOYEES'

// 新增订单
const ADD_ORDER = 'ADD_ORDER'

// 修改订单状态
const SET_ORDER = 'SET_ORDER'

// 获取订单
const GET_ORDER = 'GET_ORDER'

export const setUser = user => ({
    type: SET_USER,
    user
})

export const setPermissions = permission => ({
    type: SET_PERMISSIONS,
    permission
})

export const setIsMobile = isMobile => ({
    type: SET_ISMOBILE,
    isMobile
})

export const setMounted = isMounted => ({
    type: SET_MOUNTED,
    isMounted
})

export const addOwner = owner => ({
    type: ADD_OWNER,
    owner
})

export const setOwner = (id, owner) => ({
    type: SET_OWNER,
    id,
    owner
})

export const delOwner = id => ({
    type: DEL_OWNER,
    id
})

export const getOwner = owner => ({
    type: GET_OWNER,
    owner
})

export const getEmployees = employees => ({
    type: GET_EMPLOYEES,
    employees
})

export const addEmployees = employees => ({
    type: ADD_EMPLOYEES,
    employees
})

export const setEmployees = (id, employees) => ({
    type: SET_EMPLOYEES,
    id,
    employees
})

export const delEmployees = id => ({
    type: DEL_EMPLOYEES,
    id
})

export const addOrder = order => ({
    type: ADD_ORDER,
    order
})

export const setOrder = (id, order) => ({
    type: SET_ORDER,
    id,
    order
})

export const getOrder = order => ({
    type: GET_ORDER,
    order
})
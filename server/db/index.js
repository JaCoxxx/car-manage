const mysql = require('mysql')
const config = require('./config')

const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

let query = (sql, values) => {
    return new Promise((res, rej) => {
        pool.getConnection((err, connection) => {
            if (err) {
                rej(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        rej(err)
                    } else {
                        res(rows)
                    }
                    // 释放连接池
                    connection.release()
                })
            }
        })
    })
}

// 查询所有用户
const findAllOwner = value => {
    const _sql = 'SELECT * FROM owner;'
    return query(_sql, value)
}

// 按手机号查询用户
const findOwnerByPhone = value => {
    const _sql = 'SELECT * FROM owner WHERE phone=?;'
    return query(_sql, value)
}

// 按ID查询用户
const findOwnerById = value => {
    const _sql = 'SELECT * FROM owner WHERE id=?;'
    return query(_sql, value)
}

// 添加新用户
const insertOwner = value => {
    const _sql = 'INSERT INTO owner SET id=?,username=?,password=?,sex=?,phone=?,email=?,model=?,plate=?,reg_date=?,car_date=?,note=?;'
    return query(_sql, value)
}

// 按ID删除用户
const delOwnerById = value => {
    const _sql = 'DELETE FROM owner WHERE id=?;'
    return query(_sql, value)
}

// 修改用户密码
const updateOwnerPwdByPhone = value => {
    const _sql = 'UPDATE owner SET password=? WHERE phone=?;'
    return query(_sql, value)
}

// 更新用户信息
const updateOwnerById = value => {
    const _sql = 'UPDATE owner SET username=?,sex=?,phone=?,email=?,model=?,plate=?,car_date=?,note=? WHERE id=?;'
    return query(_sql, value)
}

// 查询所有员工
const findAllEmp = value => {
    const _sql = 'SELECT * FROM employees;'
    return query(_sql, value)
}

// 按工号查询员工
const findEmpById = value => {
    const _sql = 'SELECT * FROM employees WHERE id=?;'
    return query(_sql, value)
}

// 按权限查询员工
const findEmpByRole = value => {
    const _sql = 'SELECT * FROM employees WHERE role=?;'
    return query(_sql, value)
}

// 添加新员工
const insertEmp = value => {
    const _sql = 'INSERT INTO employees SET id=?,username=?,password=?,position=?,phone=?,sex=?,role=?;'
    return query(_sql, value)
}

// 修改员工密码
const updateEmpPwdById = value => {
    const _sql = 'UPDATE employees SET password=? WHERE id=?;'
    return query(_sql, value)
}

// 修改员工信息
const updateEmpById = value => {
    const _sql = 'UPDATE employees SET username=?,position=?,phone=?,sex=?,role=? WHERE id=?;'
    return query(_sql, value)
}

// 删除员工
const delEmpById = value => {
    const _sql = 'DELETE FROM employees WHERE id=?;'
    return query(_sql, value)
}

// 查询所有订单基本信息
const findAllBasicOrder = value => {
    const _sql = 'SELECT * FROM orders;'
    return query(_sql, value)
}

// 查询订单价格
const findOrderPrice = value => {
    const _sql = 'SELECT * FROM orders WHERE id=?;'
    return query(_sql, value)
}

// 更新订单信息
const updateOrderById = value => {
    const _sql = 'UPDATE orders SET information=?,lasttime=?,mileage=? WHERE id=?;'
    return query(_sql, value)
}

// 查询用户订单
const findOrderByOwner = value => {
    const _sql = 'SELECT * FROM orders WHERE owner_id=?;'
    return query(_sql, value)
}

// 添加新订单
const insertOrder = async (value, value2) => {
    const _sql = 'INSERT INTO orders SET id=?,owner_id=?,time=?,information=?,plate=?,lasttime=?,mileage=?,price=?,state=?;'
    const __sql = 'INSERT INTO order_status SET status_id=?,order_id=?,status="0",status_time=?,emp_id=?;'
    await query(_sql, value)
    return query(__sql, value2)
    // return query(_sql, value)
}

// 按订单号查询订单状态
const findOrderStatusById = value => {
    const _sql = 'SELECT * FROM order_status WHERE order_id=?;'
    return query(_sql, value)
}

// 按状态查询订单
const findOrderByStatus = value => {
    const _sql = 'SELECT id,owner_id,time,information,plate,mileage,lasttime,order_status.emp_id FROM orders,order_status WHERE orders.id=order_status.order_id and order_status.status=?;'
    return query(_sql, value)
}

// 按单号，状态查询订单
const findOrderByStatusId = value => {
    const _sql = 'SELECT * FROM order_status WHERE status=? and order_id=?;'
    return query(_sql, value)
}

// 添加订单状态
const insertOrderStatus = value => {
    const _sql = 'INSERT INTO order_status SET status_id=?,order_id=?,status=?,status_time=?,emp_id=?;'
    return query(_sql, value)
}

// 按员工号查询订单
const findOrderByEmp = value => {
    const _sql = 'SELECT DISTINCT o.id,o.time,o.information,o.plate FROM orders o, order_status s WHERE o.id=s.order_id and s.emp_id=?;'
    return query(_sql, value)
}
// 按订单号查询零件
const findOrderPartById = value => {
    const _sql = 'SELECT * FROM order_part WHERE order_id=?;'
    return query(_sql, value)
}

// 添加订单零件
const insertOrderPart = value => {
    const _sql = 'INSERT INTO order_part SET part_id=?,order_id=?,name=?,price=?,num=?;'
    return query(_sql, value)
}

// 修改零件信息
const updateOrderPart = value => {
    const _sql = 'UPDATE order_part SET name=?,num=?,price=? WHERE part_id=?;'
    return query(_sql, value)
}

// 删除零件
const delOrderPart = value => {
    const _sql = 'DELETE FROM order_part WHERE part_id=?;'
    return query(_sql, value)
}

// 更新订单价格
const updateOrderPriceById = value => {
    const _sql = 'UPDATE orders SET price=? WHERE id=?;'
    return query(_sql, value)
}

// 通过订单号删除订单零件
const delOrderPartById = value => {
    const _sql = 'DELETE FROM order_part WHERE order_id=?;'
    return query(_sql, value)
}

// 通过订单号删除订单状态
const delOrderStatusById = value => {
    const _sql = 'DELETE FROM order_status WHERE order_id=?;'
    return query(_sql, value)
}

// 通过ID删除订单零件
const delOrderPartByPartId = value => {
    const _sql = 'DELETE FROM order_part WHERE part_id=?;'
    return query(_sql, value)
}

// 置订单为完成状态
const setOrderDone = value => {
    const _sql = 'UPDATE orders SET state="已完成" WHERE id=?;'
    return query(_sql, value)
}

// 通过ID删除订单状态
const delOrderStatusByStatusId = value => {
    const _sql = 'DELETE FROM order_status WHERE status_id=?;'
    return query(_sql, value)
}

// 删除订单
const delOrderById = async (value) => {
    await delOrderPartById(value)
    await delOrderStatusById(value)
    const _sql = 'DELETE FROM orders WHERE id=?;'
    return query(_sql, value)
}

// 获取所有注册用户的数量
const findOwnerNum = value => {
    const _sql = ' select count(1) from owner;'
    return query(_sql, value)
}

// 获取所有订单的数量
const findOrderNum = value => {
    const _sql = 'select count(1) from orders;'
    return query(_sql, value)
}

// 获取所有进度的订单的数量
const findNumByStatus = value => {
    const _sql = 'select status,count(1) from order_status group by status;'
    return query(_sql, value)
}

// 获取所有反馈
const findFeedback = value => {
    const _sql = 'SELECT * FROM feedback order by id DESC LIMIT 5;'
    return query(_sql, value)
}

// 新增反馈
const insertFeedback = value => {
    const _sql = 'INSERT INTO feedback SET id=?,name=?,content=?,time=?;'
    return query(_sql, value)
}

module.exports = {
    findAllOwner, findAllEmp, findAllBasicOrder, findOrderStatusById, findOrderByStatus,
    findOrderPartById, findOwnerByPhone, findEmpById, findOrderByOwner, findOwnerById,
    findEmpByRole, findOrderPrice, findOwnerNum, findOrderNum, findNumByStatus, findOrderByEmp,
    findFeedback, findOrderByStatusId,
    insertOwner, insertOrder, insertEmp, insertOrderStatus, insertOrderPart, insertFeedback,
    updateOwnerPwdByPhone, updateOwnerById, updateEmpPwdById, updateEmpById, updateOrderPriceById,
    updateOrderById, setOrderDone, updateOrderPart,
    delOwnerById, delEmpById, delOrderPartById, delOrderStatusById, delOrderById,
    delOrderPartByPartId, delOrderStatusByStatusId, delOrderPart,
}
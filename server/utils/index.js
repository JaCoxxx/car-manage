const md5 = require('md5')

/**
 * 成功消息反馈
 * @param {object} {success, data, message}
 * @param  message 消息
 * @param data 数据
 * @param success 是否成功 
 */
const successResponse = ({ message = '操作成功', success = true, data = [], ...others } = {}) => {
    return JSON.parse(JSON.stringify({ data, success, message, ...others }))
}

/**
 * 失败消息反馈
 * @param {object} {success, data, message} 
 * @param  message 消息
 * @param data 数据
 * @param success 是否成功 
 */
const failedResponse = ({ message = '操作失败', success = false, data = [] } = {}) => {
    return JSON.parse(JSON.stringify({ data, success, message }));
}

/**
 * 加密密码
 * @param {string} value 加密前密码 
 */
const getPwd = value => {
    return md5(md5(`!$^%#RFT${value}%$%#$R@#ffert`))
}

/**
 * 获取权限代码
 * @param {string} value 职位
 */
const getRole = value => {
    const emp = {
        '管理员': 1,
        '维修工程师': 3,
        '维修顾问': 4,
        '财务结算员': 5,
        '超级管理员': 999,
    }
    return emp[value]
}

/**
 * 判断是否登录
 * @param {*} ctx 
 */
const checkLogin = ctx => {
    console.log(ctx.session)
    if (ctx.session && ctx.session.user) {
        return true
    }
    return false
}

// 日期格式化
const format = (date, fmt) => {
    var o = {
        "y+": date.getFullYear(),
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S+": date.getMilliseconds()             //毫秒
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            if (k === "y+") {
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if (k === "S+") {
                var lens = RegExp.$1.length;
                lens = lens === 1 ? 3 : lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
            }
            else {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
}

module.exports = {
    successResponse,
    failedResponse,
    getPwd,
    getRole,
    checkLogin,
    format,
}
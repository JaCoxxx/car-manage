- title: 基于B/S模式的汽车保养维修管理系统设计与实现
- author: 吴志远
- time: 2019年06月

## 项目配置

```
yarn install
```

## 项目启动

```
// 前端
yarn start

// 后端
yarn koa
```

数据库文件为 `car.sql`，执行完数据库命令后，需手动添加管理员信息：

```
insert into employees set id='10001',username='admin',position='管理员',phone='12345678901',sex='男',role='1',password='b56c6e850dc739d1fb2dc7d3ce5bce27';
```

数据库配置信息位于`server/db/config.js`。
密码为md5加密后的`123456`，加密方法位于`server/utils/index.js`中的`getPwd()`。

## 项目介绍

### 主要功能

1. 订单预约工作流
车主*预约订单* -> 管理员*完善订单* -> 维修顾问*分配订单* -> 维修工程师*维修订单* -> 财务结算员*核对订单* -> 财务结算员/车主*结算订单*

2. 其他功能
车主：查看个人信息、查看历史订单及订单进度、修改密码。
管理员：维护车主信息、维护员工信息、查看所有订单信息。
员工：查看个人信息、查看自己处理过的订单、修改密码。
其他：反馈建议、换肤。

### 项目结构

- config            --- webpack配置
- public            --- 入口文件
- scripts           --- 配置文件
- server            --- 后端
  - db              --- 数据库配置及交互
  - router          --- 后端路由
  - utils           --- 后端工具库
  - server.js       --- 后端启动文件
- src               --- 前端
  - axios           --- 前端接口
  - commons         --- 公共组件
  - components      --- 页面组件
  - reducer         --- 数据状态
  - routes          --- 路由
  - style           --- 样式
  - utils           --- 前端工具库
  - App.js          
  - index.js
  - serviceWorker.js
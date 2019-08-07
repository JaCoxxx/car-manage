use car;

/* 用户表 */
create table if not exists owner(
id varchar(40) NOT NULL unique,
username varchar(20) not null default '',
password varchar(32) not null default '',
sex varchar(2) not null default '男',
phone varchar(11) not null default '',
email varchar(30) not null default '',
/* 车辆型号 */
model varchar(20) not null default '',
/* 车牌号 */
plate varchar(10) not null default '',
/* 注册日期 */
reg_date date not null default '2019-02-12',
/* 购车日期 */
car_date date not null default '2012-01-12',
/* 备注 */
note varchar(100),
primary key(id)
)engine=InnoDB default charset=utf8;

/* 员工表 */
create table if not exists employees(
id varchar(40) not null unique,
username varchar(20) not null default '',
password varchar(32) not null default '',
/* 员工职称 */
position varchar(20) not null default '',
phone varchar(11) not null default '',
sex varchar(2) not null default '男',
primary key(id)
)engine=InnoDB default charset=utf8;

/* 订单表 */
create table if not exists orders(
id varchar(40) not null unique,
/* 车主ID */
owner_id varchar(40) not null default '',
/* 订单生成时间 */
time datetime not null default '2019-02-11 13:24',
/* 订单内容 */
information varchar(20) not null default '',
/* 车牌 */
plate varchar(10) not null default '',
/* 上次保养时间 */
lasttime date not null default '2019-02-21',
/* 车辆行驶里程 */
mileage varchar(20) not null default '',
/* 订单价格 */
price int not null default 0,
primary key(id),
foreign key(owner_id) references owner(id)
)engine=InnoDB default charset=utf8;

/* 订单零件表 */
create table if not exists order_part(
part_id varchar(40) not null unique,
order_id varchar(40) not null,
/* 零件名称 */
name varchar(10) not null default '',
/* 零件价格 */
price int not null default 0,
primary key(part_id),
foreign key(order_id) references orders(id)
)engine=InnoDB default charset=utf8;

/* 订单状态表 */
create table if not exists order_status(
status_id varchar(40) not null unique,
order_id varchar(40) not null,
/* 状态名 */
status varchar(2) not null default '0',
/* 发生时间 */
status_time datetime not null default '2019-02-13 13:22',
/* 负责人 */
emp_id varchar(40) not null,
primary key(status_id),
foreign key(order_id) references orders(id)
)engine=InnoDB default charset=utf8;

/* 反馈表 */
create table if not exists feedback(
id varchar(40) not null unique,
name varchar(40) not null,
content varchar(100) not null,
time date,
primary key(id)
)engine=InnoDB default charset=utf8;
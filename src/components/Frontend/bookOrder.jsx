import React, { Component } from 'react'
import { Card, Form, Input, Button, AutoComplete, DatePicker, Modal, Divider, Alert } from 'antd'
// import { isOwnerLogin } from '../../utils'
import { queryUserByPhone, addOrder, updateUserInfo } from '../../axios'
import licensePlate from '../../utils/licensePlate'
import initialEmail from '../../utils/emil'
import moment from 'moment'
import DocumentTitle from 'react-document-title'

const AutoCompleteOption = AutoComplete.Option

class BookOrder extends Component {
    state = {
        confirmDirty: false,
        autoEmail: [],
        autoPlate: [],
        orderdate: '',
        cardate: '',
        data: '',
    }
    componentWillMount() {
        // const { history } = this.props
        // isOwnerLogin().then(res => {
        //     if (!res.data.data) {
        //         history.push('/')
        //     }
        // })
        queryUserByPhone(localStorage.getItem('owner'))
            .then(res => {
                if (res.data.success) {
                    this.setState({ data: res.data.data })
                }
            })
    }

    // 提交按钮
    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props
        const { orderdate, cardate, data } = this.state
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // 调用axios API
                addOrder({
                    owner_id: data.id,
                    time: orderdate,
                    information: values.information,
                    plate: values.plate,
                    lasttime: '2000-01-01',
                    mileage: '',
                    price: 0,
                    state: '正在进行中',
                })
                    .then(res => {
                        // 更新页面信息
                        updateUserInfo({
                            username: data.username,
                            sex: data.sex || '男',
                            phone: values.phone,
                            email: values.email,
                            model: values.model,
                            plate: values.plate,
                            car_date: cardate || data.car_date || '2010-01-01',
                            note: data.note,
                            id: data.id,
                        })
                            .then(res => {
                                this.confirm()
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            }
        });
    }

    // email自动补全
    handleEmailChange = (value) => {
        let autoEmail;
        if (!value) {
            autoEmail = [];
        } else {
            autoEmail = initialEmail.map(item => `${value}${item}`);
        }
        this.setState({ autoEmail });
    }

    // 车牌自动补全
    handlePlateChange = (value) => {
        let autoPlate;
        if (!value) {
            autoPlate = [];
        } else {
            autoPlate = licensePlate.filter(item => item.includes(value)).map(item => `${item}·`)
        }
        this.setState({ autoPlate })
    }

    // 失去焦点将内容全部改为大写
    handlePlateBlur = () => {
        const { getFieldValue, setFieldsValue } = this.props.form
        getFieldValue('plate') && setFieldsValue({
            'plate': getFieldValue('plate').toUpperCase()
        })
    }

    // 日期发生更改
    onChangeDate = (date, dateString) => {
        this.setState({
            orderdate: dateString
        })

    }
    // 日期发生更改
    onChangeCarDate = (date, dateString) => {
        this.setState({
            cardate: dateString
        })

    }

    // 提交后的提示框
    confirm = () => {
        Modal.info({
            title: '预约成功',
            content: `点击确认跳转至主页`,
            onOk: this.handleClickOk,
            okText: '确认',
        })
    }

    // 点击确认页面跳转
    handleClickOk = () => {
        const { push } = this.props.history
        push('/')
    }

    // 日期禁选
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    handleClickFill = () => {
        const { data } = this.state
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            'username': data.username,
            'phone': data.phone,
            'email': data.email,
            'plate': data.plate,
            'model': data.model,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { autoEmail, autoPlate } = this.state
        const emailOptions = autoEmail.map(email => (
            <AutoCompleteOption key={email}>{email}</AutoCompleteOption>
        ));
        const plateOptions = autoPlate.map(plate => (
            <AutoCompleteOption key={plate}>{plate}</AutoCompleteOption>
        ))
        return (
            <DocumentTitle title="预约-保车网">
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Card title="预约" bordered={false} style={{ width: '100%' }} extra={<Button onClick={this.handleClickFill}>填充个人信息</Button>}>
                        <Alert message="为了保证您的个人信息的准确性，当您提交订单时，相关的个人信息也会更改为以下信息" type="info" showIcon />
                        <Form onSubmit={this.handleSubmit}>
                            <Divider>我们如何联系你？</Divider>
                            <Form.Item label="姓名">
                                {
                                    getFieldDecorator('username', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入姓名',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="例如：张三" />
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="手机号">
                                {
                                    getFieldDecorator('phone', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入手机号',
                                            },
                                            {
                                                pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                                                message: '请输入正确格式的手机号'
                                            },
                                        ],
                                    })(
                                        <Input placeholder="例如：12345678901" />
                                    )
                                }
                            </Form.Item>
                            <Form.Item
                                label="E-mail"
                            >
                                {getFieldDecorator('email', {
                                    rules: [{
                                        type: 'email', message: '输入的内容不是邮箱格式!',
                                    }, {
                                        required: true, message: '请输入邮箱!',
                                    }],
                                })(
                                    <AutoComplete
                                        dataSource={emailOptions}
                                        onChange={this.handleEmailChange}
                                        placeholder="例如：123456@qq.com"
                                    >
                                        <Input />
                                    </AutoComplete>
                                )}
                            </Form.Item>

                            <Divider>你准备什么时候来？</Divider>
                            <Form.Item label="预约日期">
                                {
                                    getFieldDecorator('orderdate', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择预约时间',
                                            }
                                        ],
                                    })(
                                            <DatePicker showTime format="YYYY-MM-DD HH:MM" disabledDate={this.disabledDate} onChange={this.onChangeDate} />
                                    )
                                }
                            </Form.Item>
                            <Divider>关于你的车辆的信息？</Divider>
                            <Form.Item label="车辆品牌型号">
                                {
                                    getFieldDecorator('model', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入车辆品牌型号',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="例如：宝马i3" />
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="车牌">
                                {
                                    getFieldDecorator('plate', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入车牌号码'
                                            },
                                            {
                                                min: 8,
                                                max: 10,
                                                message: '请输入正确格式的车牌号码'
                                            },
                                        ],
                                    })(
                                        <AutoComplete
                                            dataSource={plateOptions}
                                            onChange={this.handlePlateChange}
                                            defaultOpen={false}
                                            children={<Input />}
                                            onBlur={this.handlePlateBlur}
                                            placeholder="例如：陕A·12345"
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="详细描述">
                                {
                                    getFieldDecorator('information', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入描述',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="例如：我想修一下左边的前轮，它有些漏气了。" />
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="购车日期">
                                {
                                    getFieldDecorator('cardate')(
                                        <DatePicker onChange={this.onChangeCarDate} />
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">提交</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </DocumentTitle>
        );
    }
}

export default Form.create({ name: 'order' })(BookOrder)
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import {
    Form, Input, Button, AutoComplete, DatePicker, Modal, Icon
} from 'antd'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { format } from '../../../utils'
import { addOwnerByAdmin } from '../../../reducer/owner'
import licensePlate from '../../../utils/licensePlate'
import initialEmail from '../../../utils/emil'

const AutoCompleteOption = AutoComplete.Option

class AddUser extends Component {
    state = {
        confirmDirty: false,
        autoEmail: [],
        autoPlate: [],
        date: '',
    };


    // 提交按钮
    handleSubmit = (e) => {
        e.preventDefault();
        const { addOwner, form } = this.props
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                const result = await addOwner({
                    id: +new Date() + 'owner',
                    username: values.username,
                    password: '123456',
                    sex: '男',
                    phone: values.phone,
                    email: values.email,
                    model: values.model,
                    plate: values.plate,
                    reg_date: format(new Date(), 'yy-MM-dd hh:mm:ss'),
                    car_date: this.state.date || '2018-08-08',
                    note: '',
                    
                })
                console.log(result)
                if(result.data.success || result === true) {
                    this.confirm(values)
                } else {
                    form.setFields({
                        'phone': {
                            value: null,
                            errors: [new Error(result.data.message)]
                        }
                    })
                }
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
            date: dateString
        })

    }

    // 提交后的提示框
    confirm = (values) => {
        Modal.confirm({
            title: '添加成功',
            content: `该用户登录名为：${values.phone}，初始密码为：123456,点击确认跳转至用户查看界面，点击取消继续添加用户`,
            onOk: this.handleClickOk,
            onCancel: this.handleClickCancel,
            okText: '确认',
            cancelText: '取消',
            icon: <Icon type="check-circle" />,
        })
    }

    // 点击确认页面跳转
    handleClickOk = () => {
        const { push } = this.props.history
        push('/app/user/showuser')
    }

    // 点击取消刷新页面
    handleClickCancel = () => {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            'username': null,
            'phone': null,
            'email': null,
            'plate': null,
            'model': null,
            'car_date': null,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoEmail, autoPlate } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },

            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 8 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        }

        const emailOptions = autoEmail.map(email => (
            <AutoCompleteOption key={email}>{email}</AutoCompleteOption>
        ));
        const plateOptions = autoPlate.map(plate => (
            <AutoCompleteOption key={plate}>{plate}</AutoCompleteOption>
        ))

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                <Form.Item label="车辆型号">
                    {
                        getFieldDecorator('model', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入车辆型号',
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
                <Form.Item label="购车日期">
                    {
                        getFieldDecorator('car_date')(
                            <DatePicker onChange={this.onChangeDate} />
                        )
                    }
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        );
    }
}

AddUser.porpTypes = {
    addOwner: PropTypes.func
}

const mapStateToProps = ({ Owner }) => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        addOwner(owner) {
            return addOwnerByAdmin(owner)(dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'register' })(AddUser))
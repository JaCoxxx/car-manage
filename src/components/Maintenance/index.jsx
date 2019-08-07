import React, { Component } from 'react'
import { queryOrderByStatus, queryPartById, addOrderStatus } from '../../axios'
import { Table, Card, Modal, Form, Input, message, Radio, InputNumber, Popconfirm } from 'antd'
import { format } from '../../utils'
import { addPartById, updatePartById, delPartById } from '../../axios'
import moment from 'moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const EditableContext = React.createContext()

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class Maintenance extends Component {
    state = {
        data: [],
        visible: false,
        modalVisible: false,
        showVisible: false,
        id: '',
        part: [],
        partData: [],
        editingKey: '',
    }
    componentDidMount() {
        this.getOrder()
    }
    // 获取当前阶段的订单
    getOrder = () => {
        queryOrderByStatus(['2', JSON.parse(localStorage.getItem('user')).uid])
            .then(res => {
                if (res.data.success) {
                    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                        this.setState({
                            data: res.data.data.map(item => ({
                                ...item,
                                time: format(new Date(item.time), 'yyyy-MM-dd'),
                                key: item.id
                            }))
                        })
                    }

                }
            })
    }

    handleClickDis = (id) => {
        this.setState({ id }, () => this.showModal())
    }

    handleClickSubmit = (id) => {
        queryPartById(id)
            .then(res => {
                if (res.data.success) {
                    if (res.data.data.length === 0) {
                        Modal.warning({
                            title: '警告',
                            content: '该订单尚未填写具体维修项目',
                            okText: '确认',
                        })
                    } else {
                        addOrderStatus({
                            status_id: +new Date(),
                            order_id: id,
                            status: '3',
                            status_time: moment().format('YYYY-MM-DD hh:mm:ss'),
                            emp_id: '10004',
                        })
                            .then(res => {
                                if (res.data.success) {
                                    message.success('提交成功')
                                    this.getOrder()
                                }
                            })
                    }
                }
            })
    }


    showModal = () => {
        this.setState({ modalVisible: true });
    }

    handleCancel = () => {
        this.setState({ modalVisible: false });
    }

    handleCreate = () => {
        const form = this.props.form
        const { id } = this.state
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let isTrue = true
            if (values.num - 0 > 10 || values.price - 0 > 200000) {
                Modal.confirm({
                    title: '警告',
                    content: '检测到填写的信息可能存在异常，是否继续提交？',
                    onOk() {
                        addPartById({
                            part_id: + new Date(),
                            order_id: id,
                            name: values.name,
                            price: values.price - 0,
                            num: values.num - 0,
                        })
                            .then(res => {
                                if (res.data.success) {
                                    form.resetFields()
                                    message.success('添加成功')
                                } else {
                                    form.resetFields()
                                    message.warning(res.data.message)
                                }
                            })
                    },
                    onCancel() {

                    },
                })
            } else {
                addPartById({
                    part_id: + new Date(),
                    order_id: id,
                    name: values.name,
                    price: values.price - 0,
                    num: values.num - 0,
                })
                    .then(res => {
                        if (res.data.success) {
                            form.resetFields()
                            message.success('添加成功')
                        } else {
                            form.resetFields()
                            message.warning(res.data.message)
                        }
                    })
            }

        });
    }

    handleShowPart = (id) => {
        queryPartById(id)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        partData: res.data.data.map(item => ({
                            ...item,
                            key: item.part_id,
                        })),
                        showVisible: true
                    })
                }
            })

    }

    handleSCancel = () => {
        this.setState({ showVisible: false })
    }

    handleSCreate = () => {
        this.setState({ showVisible: false })
    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.partData];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                })
                updatePartById({
                    ...row,
                    part_id: key
                })
                    .then(res => {
                        if (res.data.success) {
                            message.success('修改成功')

                        } else {
                            message.warning(res.data.data.message)
                        }
                    })
                    .catch(err => console.log(err))
                this.setState({ partData: newData, editingKey: '' });
            } else {
                newData.push(row)
                this.setState({ partData: newData, editingKey: '' });
            }
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    remove(key) {
        console.log(key)
        const { id } = this.state
        delPartById(key)
            .then(res => {
                if (res.data.success) {
                    message.success('删除成功')
                    queryPartById(id)
                        .then(res => {
                            if (res.data.success) {
                                this.setState({
                                    partData: res.data.data.map(item => ({
                                        ...item,
                                        key: item.part_id,
                                    }))
                                })
                            }
                        })
                } else {
                    message.warning(res.data.data.message)
                }
            })
            .catch(err => message.warning(err))
    }

    render() {
        const { data, modalVisible, showVisible, partData } = this.state
        const { getFieldDecorator } = this.props.form
        const columns = [
            { title: '单号', dataIndex: 'id', key: 'id', },
            { title: '详情', dataIndex: 'information', key: 'information', },
            { title: '车牌', dataIndex: 'plate', key: 'plate', },
            { title: '时间', dataIndex: 'time', key: 'time', },
            {
                title: '操作', key: 'action', render: (text, record) => (
                    <Radio.Group size="small" style={{ borderRadius: '15px' }}>
                        <Radio.Button value="dis" onClick={() => this.handleClickDis(record.id)}>填写信息</Radio.Button>
                        <Radio.Button value="show" onClick={() => this.handleShowPart(record.id)}>查看信息</Radio.Button>
                        <Radio.Button value="submit" onClick={() => this.handleClickSubmit(record.id)}>提交订单</Radio.Button>
                    </Radio.Group>
                )
            }
        ]
        const partColumns = [
            { title: '名称', dataIndex: 'name', key: 'name', editable: true, },
            { title: '数量', dataIndex: 'num', key: 'num', editable: true, },
            { title: '单价', dataIndex: 'price', key: 'price', editable: true, },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return (
                        <Radio.Group size='small' >
                            {editable ? (
                                <span>
                                    <EditableContext.Consumer>
                                        {form => (
                                            <Radio.Button
                                                onClick={() => this.save(form, record.key)}
                                            >
                                                保存
                                            </Radio.Button>
                                        )}
                                    </EditableContext.Consumer>
                                    <Popconfirm
                                        title="确定吗?"
                                        onConfirm={() => this.cancel(record.key)}
                                    >
                                        <Radio.Button>取消</Radio.Button>
                                    </Popconfirm>
                                </span>
                            ) : (
                                    <span>
                                        <Radio.Button disabled={editingKey !== ''} onClick={() => this.edit(record.key)} >编辑</Radio.Button>
                                        <Popconfirm title="确定删除吗?" onConfirm={() => this.remove(record.key)}>
                                            <Radio.Button disabled={editingKey !== ''} >删除</Radio.Button>
                                        </Popconfirm>
                                    </span>
                                )}
                        </Radio.Group>
                    )
                },
            },
        ]
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const partColumn = partColumns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="正处理订单" bordered={false} >
                    <Table columns={columns} dataSource={data} />
                </Card>
                <Modal
                    visible={modalVisible}
                    title="添加条目"
                    okText="添加"
                    onCancel={this.handleCancel}
                    onOk={this.handleCreate}
                    width={650}
                >
                    <Form layout="inline">
                        <Form.Item>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入零件名称或项目名!' }],
                            })(
                                <Input placeholder="零件名称或项目名" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('num', {
                                rules: [{ required: true, message: '请输入数量（次数）!' }],
                            })(
                                <Input type="number" placeholder="数量（次数）" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('price', {
                                rules: [{ required: true, message: '请输入单价!' }],
                            })(
                                <Input type="number" placeholder="单价(单位：元)" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={showVisible}
                    title="查看详情"
                    okText="确定"
                    onCancel={this.handleSCancel}
                    onOk={this.handleSCreate}
                    width={650}
                >
                    <EditableContext.Provider value={this.props.form}>
                        <Table components={components} pagination={false} columns={partColumn} rowClassName="editable-row" dataSource={partData} />
                    </EditableContext.Provider>
                </Modal>
            </div>
        );
    }
}

Maintenance.propTypes = {
    user: PropTypes.object
}

const mapStateToProps = ({ UserPer }) => {
    return {
        user: UserPer.user
    }
}


export default connect(mapStateToProps)(Form.create({ name: 'part' })(Maintenance))
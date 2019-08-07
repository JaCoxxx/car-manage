/* eslint-disable jsx-a11y/anchor-is-valid */
/***
 * 
 * 公共表格组件，编辑、搜索等功能
 * 需接收参数
 *      columns: Array 表头
 *      data: Array 数据
 *      title: String 页面标题
 *      handleEdit: func(key, row) 修改内容函数
 *      handleRemove: func(key) 删除某一项
 *      handleRefresh: func 刷新
 *      scrollx: number 表格宽度
 * 
 */
import React, { Component } from 'react';

import {
    Table, Button, Row, Col, Card, Input, Icon, InputNumber, Popconfirm, Form, Radio,
} from 'antd';
import Highlighter from 'react-highlight-words'

const FormItem = Form.Item;
const EditableContext = React.createContext()

// 构建可编辑表格
class EditableCell extends Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `请输入${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

class TableTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [], // 选中行
            loading: false, // 数据加载状态
            searchText: '', // 搜索文字
            editingKey: '',
        }
        // 表头
        this.columns = this.props.columns
            .map((item, index) => ({
                ...item,
                ...this.getColumnSearchProps(item.dataIndex || item.key),
                width: (index === 0) ? 100 : 'auto',
                fixed: (index === 0) ? true : false,
            }))
            .concat({
                title: 'Action',
                key: 'operation',
                fixed: 'right',
                width: 200,
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
                                    // <span>
                                    //     <span disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>编辑</span>
                                    //     <span disabled={editingKey !== ''}>删除</span>
                                    // </span>

                                    <span>
                                        <Radio.Button disabled={editingKey !== ''} onClick={() => this.edit(record.key)} >编辑</Radio.Button>
                                        <Popconfirm title="确定删除吗?" onConfirm={() => this.remove(record.key)}>
                                            <Radio.Button disabled={editingKey !== ''} >删除</Radio.Button>
                                        </Popconfirm>
                                    </span>

                                )}
                        </Radio.Group>
                    )
                }
            })

    }

    // 刷新
    start = async () => {
        const { handleRefresh } = this.props
        this.setState({ loading: true })
        await handleRefresh()
        this.setState({ loading: false })
    }

    // 判断是否可修改
    isEditing = record => record.key === this.state.editingKey;

    // 取消修改
    cancel = () => {
        this.setState({ editingKey: '' });
    };

    // 保存修改内容
    save(form, key) {
        const { handleEdit } = this.props
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            handleEdit(key, row)
            this.setState({ editingKey: '' })
            // const newData = [...data];
            // const index = newData.findIndex(item => key === item.key);
            // if (index > -1) {
            //     const item = newData[index];
            //     newData.splice(index, 1, {
            //         ...item,
            //         ...row,
            //     });
            //     this.setState({ editingKey: '' });
            // } else {
            //     newData.push(row);
            //     this.setState({ editingKey: '' });
            // }
        });
    }

    // 修改
    edit(key) {
        this.setState({ editingKey: key });
    }

    // 删除
    remove(key) {
        const { handleRemove } = this.props
        handleRemove(key)
    }

    // 更改选中的行数
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    // 列搜索功能函数
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
            </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    // 搜索确定
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    // 搜索重置
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    render() {
        const { loading, selectedRowKeys } = this.state;
        const { data = [], scrollx = 1200 } = this.props
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,
        // };
        const hasSelected = selectedRowKeys.length > 0;
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
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
        })
        return (
            <div className="gutter-example">
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title={this.props.title || ''} bordered={false}>
                                <div style={{ marginBottom: 16 }}>
                                    <Button type="primary" onClick={this.start}
                                        disabled={loading} loading={loading}
                                    >刷新</Button>
                                    <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
                                </div>
                                <EditableContext.Provider value={this.props.form}>
                                    <Table
                                        components={components}
                                        // rowSelection={rowSelection}
                                        bordered
                                        dataSource={data}
                                        columns={columns}
                                        scroll={{ x: scrollx }}
                                        rowClassName="editable-row"
                                        pagination={{
                                            onChange: this.cancel,
                                        }}
                                    />
                                </EditableContext.Provider>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.create()(TableTemplate)
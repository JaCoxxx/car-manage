import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Divider, List, Icon, Button, Form, Input, message } from 'antd'
import { addFeedback } from '../../axios'
import { format } from '../../utils'

const { TextArea } = Input

class About extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                addFeedback({
                    id: +new Date(),
                    name: values.name,
                    content: values.content,
                    time: format(new Date(), 'yyyy-MM-dd hh:mm:ss')
                })
                    .then(res => {
                        if (res.data.success) {
                            message.success('提交成功')
                        } else {
                            message.warning(res.data.message)
                        }
                    })
                    .catch(err => message.warning(err))
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <DocumentTitle title="关于-保车网">
                <div>
                    <Divider orientation="left" style={{ fontWeight: 'bolder', fontSize: '25px' }}>联系我们</Divider>
                    <List
                        size="small"
                        style={{ width: '70%', margin: '0 0 0 40px' }}
                    >
                        <List.Item>
                            <Icon style={{ marginRight: 5 }} type="qq" />1759668379
                        </List.Item>
                        <List.Item>
                            <Icon style={{ marginRight: 5 }} type="github" /><a target="_blank" href="https://github.com/JaCoxxx/JaCoxxx.github.io">JaCoxxx</a>
                        </List.Item>
                        <List.Item>
                            <Icon style={{ marginRight: 5 }} type="wechat" />jay51314
                        </List.Item>
                        <List.Item>
                            <Icon style={{ marginRight: 5 }} type="phone" />183****2398
                        </List.Item>
                        <List.Item>
                            <Icon style={{ marginRight: 5 }} type="home" />陕西省西安市临潼区
                        </List.Item>
                    </List>
                    <Divider orientation="left" style={{ fontWeight: 'bolder', fontSize: '25px' }}>建议&反馈</Divider>
                    <Form
                        onSubmit={this.handleSubmit}
                        className="login-form"
                        style={{ width: '70%', margin: '0 0 0 40px' }}
                    >
                        <Form.Item
                            label="姓名"
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入你的姓名!' }],
                            })(
                                <Input
                                    placeholder="姓名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item
                            label="内容"
                        >
                            {getFieldDecorator('content', {
                                rules: [{ required: true, message: '请输入你的建议或反馈!' }],
                            })(
                                <TextArea
                                    rows={4}
                                    placeholder="建议&反馈"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </DocumentTitle>
        );
    }
}

export default Form.create({ name: 'feedback' })(About)
import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { Card, Steps, Divider, Modal } from 'antd'
import './index.css'
import ImgSrc from '../../style/imgs/car003.jpg'

const Step = Steps.Step
const { Meta } = Card

class Main extends Component {
    handleClickOrder = () => {
        const { history } = this.props
        if (localStorage.getItem('owner')) {
            history.push('/main/bookorder')
        } else {
            Modal.info({
                title: '提示',
                content: (
                    <div>
                        <p>请登录后再来预约</p>
                    </div>
                ),
            });
        }
    }
    render() {
        return (
            <DocumentTitle title="主页-保车网">
                <div
                    style={{ width: '100%', height: '100%', backgroundColor: '#fff', margin: '0 0 10px 0' }}
                >
                    <Card
                        // hoverable
                        style={{ width: '85%', margin: '0 auto' }}
                        cover={<img alt="example" src={ImgSrc} />}
                    >
                        <Meta
                            title="预约下单"
                            style={{ cursor: 'pointer' }}
                            onClick={this.handleClickOrder}
                        />
                    </Card>
                    <div
                        style={{ margin: '30px auto 0', width: '85%' }}
                    >
                        <Divider
                            style={{ padding: '20px 0' }}
                        >服务项目</Divider>
                        <p>
                            自1999年以来，保车网一直在西安市提供优质的汽车维修和维护服务。
                            我们是一家家族拥有和经营的企业，为临潼区、灞桥区、新城区、潼关、莲湖区及周边地区的人民提供诚实和专业的汽车维修和维护服务。
                        </p>
                        <p>
                            保车网是一家经过认证的汽车护理中心，这意味着我们既能够提供优质的服务，同时保持着个人风格。
                            我们知道您的车辆是一项重大投资，这就是我们关注每辆车的原因，就好像它是我们自己的一样。
                        </p>
                        <p>
                            我们的机械师都是认证过的技术人员，并使用最新的汽车技术处理国内和进口车辆的主要和次要汽车维修。
                            在最新的诊断和计算机设备的支持下，以及对最新的维修信息和维修数据库的访问，我们的技术人员能够处理业务中的所有诊断服务。
                            我们的服务还有24个月/24,000英里的保修期。
                            因此，请立即致电或安排在线预约，让保车网满足您的所有汽车服务需求！
                        </p>
                    </div>
                    <div
                        style={{ margin: '30px auto 0', width: '85%' }}
                    >
                        <Divider
                            style={{ padding: '20px 0' }}
                        >服务流程</Divider>
                        <Steps progressDot current={0} >
                            <Step title="在线预约" description="在线预约，一键轻松下单" />
                            <Step title="到店确认" description="下单成功后，到店核对订单基本信息" />
                            <Step title="技师分配" description="根据具体项目分配维修工程师" />
                            <Step title="进厂维修" description="维修工程师维修车辆，完善订单详细信息" />
                            <Step title="财务结算" description="根据服务项目核对订单" />
                            <Step title="收取费用" description="服务完成后，收取相应的服务费用" />
                        </Steps>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

export default Main;
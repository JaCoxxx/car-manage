import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Allcomponents from '../index'

class RouteIntercept extends Component {
    render() {
        const { user } = this.props
        const Component = (() => {
            switch (user.roleType) {
                case 0:
                case 1:
                case 2: // 管理员
                    return (<Allcomponents.Main />)
                case 3: // 维修工程师
                    return (<Allcomponents.Maintenance />)
                case 4: // 维修顾问
                    return (<Allcomponents.Consultant />)
                case 5: // 财务结算员
                    return (<Allcomponents.Financial />)
                default: // 其他
                    return (<Allcomponents.Main />)
            }
        })
        return (
            <Component {...this.props} />
        );
    }
}

RouteIntercept.propTypes = {
    user: PropTypes.object
}

const mapStateToProps = ({ UserPer }) => {
    return {
        user: UserPer.user
    }
}

export default connect(mapStateToProps)(RouteIntercept)
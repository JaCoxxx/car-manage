import React, { Component } from 'react';
import { isLogin } from '../../utils'
import { Redirect } from 'react-router-dom'
// import AllComponents from '../../components'
import AllCommons from '../index'


/**
 * 路由拦截
 *
 * @class Intercept
 * @extends {Component}
 */
class Intercept extends Component {
    render() {
        const component = isLogin()._isLogin ? <AllCommons.Page /> : <Redirect to="/login" push />
        return ( component )
    }
}

export default Intercept;
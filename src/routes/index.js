import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import queryString from 'querystring'
import Config from './config'
import { isLogin } from '../utils'
import AllComponents from '../components'
import AllCommons from '../commons'

class Router extends Component {
    render() {
        return (
            <Switch>
                {
                    Object.keys(Config).map(item => Config[item].map(routes => {
                        // item: menus/others
                        // routes: 每一项路由
                        // route: 路由标签
                        // r： 路由对象
                        const route = r => {
                            const Component = AllComponents[r.component]
                            return (
                                <Route
                                    key={r.route || r.key}
                                    exact
                                    path={r.route || r.key}
                                    name={r.name}
                                    disabled={isLogin().user.roleType !== r.roleType || r.roleType !== 0}
                                    render={
                                        props => {
                                            // 匹配query
                                            const queryParams = window.location.hash.match(/\?\S*/g)
                                            // 去除query
                                            const { params } = props.match
                                            Object.keys(params).forEach(key => {
                                                params[key] = params[key] && params[key].replace(/\?\S*/g, '')
                                            })
                                            props.match.params = { ...params }
                                            const merge = { ...props, query: queryParams ? queryString.parse(queryParams[0].slice(1)) : {} }
                                            // 包装组件
                                            const wrappedComponent = (
                                                <DocumentTitle title={r.title}>
                                                    <div>
                                                        <AllCommons.BreadcrumbCus father={r.father || ''} name={r.title} />
                                                        <Component {...merge} />
                                                    </div>
                                                </DocumentTitle>
                                            )
                                            return isLogin()._isLogin ? wrappedComponent : (<Redirect to="/login" push />)
                                        }
                                    }
                                ></Route>
                            )
                        }
                        if( isLogin().user.roleType === routes.roleType || routes.roleType === 0 || isLogin().user.roleType === 999 ) {
                            return (routes.component ? route(routes) : routes.subs.map(r => route(r)))
                        }
                        return null
                    }))
                }
                <Route render={() => <Redirect to="/404" push />}></Route>
            </Switch>
        );
    }
}

export default Router;
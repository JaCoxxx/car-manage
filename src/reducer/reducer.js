import { combineReducers } from 'redux'
import { Owner } from './owner'
import { Employees } from './employees'
import { Order } from './order'

const initialUser = {
    user: JSON.parse(localStorage.getItem('user')) || {
        role: '访客',
        roleType: 2,
        uid: 1,
        userName: 'guest'
    },
    permissions: ["auth", "auth/authPage", "auth/authPage/visit"]
}

const UserPer = (state = initialUser, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            }
        case 'SET_PERMISSIONS':
            return {
                ...state,
                permissions: action.permissions
            }
        default:
            return state
    }
}

const Responsive = (state = { isMobile: false, isMounted: true }, action) => {
    switch (action.type) {
        case 'SET_ISMOBILE':
            return {
                ...state,
                isMobile: action.isMobile
            }
        case 'SET_MOUNTED':
            return {
                ...state,
                isMounted: action.isMounted
            }
        default:
            return state
    }
}

export default combineReducers({
    UserPer, Responsive, Owner, Employees, Order
})
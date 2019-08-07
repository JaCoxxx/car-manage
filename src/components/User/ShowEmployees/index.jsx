import React, { Component } from 'react';
import Allcomponent from '../../index'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getAllEmp } from '../../../reducer/employees'
import { setEmployees, delEmployees } from '../../../reducer/actions';

class ShowEmployees extends Component {
    componentWillMount() {
        const { getEmp } = this.props
        getEmp()
    }
    handleRefreshEmp = () => {
        const { getEmp } = this.props
        getEmp()
    }
    handleEditEmployees = (key, row) => {
        const { employees, setEmployees } = this.props
        setEmployees(employees[employees.findIndex(item => key === item.key)].id, row)
    }
    handleRemoveEmp = key => {
        const { employees, delEmp } = this.props
        delEmp(employees[employees.findIndex(item => key === item.key)].id)
    }
    render() {
        const { employees, employeesColumns } = this.props
        const title = "所有员工"
        return (
            <Allcomponent.TableTemplate
                scroll={800}
                handleEdit={this.handleEditEmployees}
                handleRemove={this.handleRemoveEmp}
                handleRefresh={this.handleRefreshEmp}
                title={title}
                columns={employeesColumns}
                data={employees}
            />
        );
    }
}

ShowEmployees.propTypes = {
    employees: PropTypes.array,
    employeesColumns: PropTypes.array,
    setEmployees: PropTypes.func,
    getEmp: PropTypes.func,
    delEmp: PropTypes.func
}

const mapStateToProps = ({ Employees }) => {
    return {
        employees: Employees.employees,
        employeesColumns: Employees.employeesColumns
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setEmployees(id, employees) {
            dispatch(setEmployees(id, employees))
        },
        delEmp(id) {
            dispatch(delEmployees(id))
        },
        getEmp() {
            getAllEmp()(dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowEmployees)
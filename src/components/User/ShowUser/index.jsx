/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import Allcomponent from '../../index'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setOwner, delOwner } from '../../../reducer/actions';
import { getAllOwner } from '../../../reducer/owner'

class ShowUser extends Component {
    componentWillMount() {
        const { getOwners } = this.props
        getOwners()
    }

    handleRefreshOwner = () => {
        const { getOwners } = this.props
        getOwners()
    }

    handleEditOwner = (key, row) => {
        const { owner, setOwner } = this.props
        setOwner(owner[owner.findIndex(item => key === item.key)].id, row)
    }

    handleRemoveOwner = key => {
        const { owner, delOwner } = this.props
        delOwner(owner[owner.findIndex(item => key === item.key)].id)
    }
    render() {
        const { owner, ownerColumns } = this.props
        const title = "所有用户"
        return (
            <Allcomponent.TableTemplate
                scrollx={1500}
                handleEdit={this.handleEditOwner}
                handleRemove={this.handleRemoveOwner}
                handleRefresh={this.handleRefreshOwner}
                title={title}
                columns={ownerColumns}
                data={owner}
            />
        );
    }
}

ShowUser.propTypes = {
    owner: PropTypes.array,
    ownerColumns: PropTypes.array,
    setOwner: PropTypes.func,
    delOwner: PropTypes.func,
    getOwners: PropTypes.func,
}

const mapStateToProps = ({ Owner }) => {
    return {
        owner: Owner.owner,
        ownerColumns: Owner.ownerColumns
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOwner(id, owner) {
            dispatch(setOwner(id, owner))
        },
        delOwner(id) {
            dispatch(delOwner(id))
        },
        getOwners() {
            return getAllOwner()(dispatch)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowUser)
import React from 'react'
import PropTypes from 'prop-types'
import st from './TableActions.module.css'
import GpIcon from '../Icon'
import DlButton from '../Button'

const TableActions = ({ onDelete, onEdit, onRestore }) => {
    const canEdit = typeof onEdit === 'function'
    const canRestore = typeof onRestore === 'function'
    const canDelete = typeof onDelete === 'function'
    return (
        <span className={st.ta}>
            {canEdit &&
                <span className={st.taItem}>
                    <DlButton size="xs" icon circle bgColor="#F0F0F0" type="text" onClick={onEdit}>
                        <GpIcon name="edit" size={20} color="var(--color-primary)" />
                    </DlButton>
                </span>
            }
            {canDelete &&
                <span className={st.taItem}>
                <DlButton size="xs" icon circle bgColor="#F0F0F0" onClick={onDelete}>
                        <GpIcon name="delete" size={20} color="var(--color-primary)" />
                    </DlButton>
                </span>
            }
            {canRestore &&
                <span className={st.taItem}>
                <DlButton size="xs" icon circle bgColor="#F0F0F0" onClick={onRestore}>
                        <GpIcon name="refresh" size={20} color="var(--color-primary)" />
                    </DlButton>
                </span>
            }
        </span>
    )
}

TableActions.propTypes = {
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onRestore: PropTypes.func,
}

export default TableActions

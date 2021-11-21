import st from "./LabAssistant.module.css";
import PropTypes from "prop-types";
import DlButton from "../Shared/Button";
import GpIcon from "../Shared/Icon";
import React from "react";

const LabAssistant = props => {
    const onDelete = (assistantId) => {
        if (typeof(props.onDelete) === "function") {
            props.onDelete(assistantId)
        }
    }

    return (
        <div className={st.labAssistantContainer}>
            <div className={st.assistantAvatar}>{`${props.first_name[0]}${props.last_name[0]}`}</div>
            <div className={st.assistantName}>{props.first_name} {props.last_name}</div>
            <div className={st.deleteAssistantButton}>
                <DlButton size="xs" icon circle bgColor="#F0F0F0" onClick={() => onDelete(props.id)}>
                    <GpIcon name="delete" size={20} color="var(--color-error)" />
                </DlButton>
            </div>
        </div>
    )
}

LabAssistant.propTypes = {
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string
}

export default LabAssistant
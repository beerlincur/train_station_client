import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import st from './Table.module.css'
import { get as _get } from 'lodash'
import { Fragment } from 'react'

const getColStyle = (header) => {
    let obj = {};
    if (header && header.width) {
        obj.width = `${header.width}`
        obj.display = 'inline-flex'
    }
    return obj;
}
const getCellStyle = (header) => {
    let obj = {};
    if (header && header.minWidth) {
        obj[`--min-width`] = `${header.minWidth}px`
    }
    return obj;
}

const DlTableCell = ({ Component, ...props }) => {
    if (Component) {
        return <Component {...props} />
    }
    return <span>{props.content}</span>
}

// todo add sorting
const DlTable = ({ headers = [], tableData = [], ...props }) => {

    const getRowClasses = (index, rowData) => {
        let classes = [st.row]
        if (props.highLight) {
            classes.push(st.highlight)
        }
        if (typeof props.rowClassName === 'string' && props.rowClassName) {
            classes.push(props.className)
        }
        if (typeof props.rowClassName === 'function') {
            const result = props.rowClassName(index, rowData)
            if (typeof result === 'string') {
                classes.push(result)
            } else {
                console.warn("rowClassName must return a string...");
            }
        }
        return classes;
    }

    const getColClasses = (index, header) => {
        let classes = [st.cell, header.classname]
        if (header.nowrap) {
            classes.push(st.nowrap)
        }
        if (typeof props.colClassName === 'string' && props.colClassName) {
            classes.push(props.className)
        }
        if (typeof props.colClassName === 'function') {
            const result = props.colClassName(index, header)
            if (typeof result === 'string') {
                classes.push(result)
            } else {
                console.warn("colClassName must return a string...");
            }
        }
        return classes;
    }

    return (
        <div className={cx(st.container)}>
            <table className={cx(st.table, { [st.fixed]: props.fixed })}>
                <thead>
                    <tr className={cx(st.row, st.heading)}>
                        {headers.map((header, i) => (
                            <th
                                className={cx(st.cell, st.header, { [st.nowrap]: header.nowrap })}
                                style={getCellStyle(header)}
                                key={i}
                            >
                                <span style={getColStyle(header)}>
                                    {header.label}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, k) => (
                        <Fragment key={k}>
                            <tr className={cx(getRowClasses(k, item))}>
                                {headers.filter(he => he.name !== 'actions').map((header, j) => (
                                    <td
                                        className={cx(getColClasses(j, header))}
                                        key={j}
                                    >
                                        <span style={getColStyle(header)}>
                                            <DlTableCell
                                                Component={props[header.name]}
                                                content={_get(item, header.name, "")}
                                                header={header}
                                                rowData={item}
                                                rowIndex={k}
                                            />
                                        </span>
                                    </td>
                                ))}
                                {props.actions &&
                                    <td className={cx(st.cell, st.last)}>
                                        <DlTableCell
                                            Component={props.actions}
                                            rowData={item}
                                            rowIndex={k}
                                        />
                                    </td>
                                }
                            </tr>
                            {item.tooltip &&
                                <tr className={st.tooltip}>
                                    <td colSpan={headers.length} className={cx(st.cell, st.cellTooltip)}>
                                        <span className={st.tooltipContent}>
                                            <span className={st.tooltipInner}>
                                                {item.tooltip}
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            }
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

DlTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        width: PropTypes.string,
        warp: PropTypes.bool,
    })),
    tableData: PropTypes.array,
    highLight: PropTypes.bool,
    fixed: PropTypes.bool,
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    colClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
}

export default DlTable

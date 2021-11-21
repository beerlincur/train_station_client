import DlTable from "../Shared/Table"
import TableActions from "../Shared/TableActions";
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
const headers = [
    { name: "id", label: "№", width: "30px" },
    { name: "indicator", label: "Показатель" },
    { name: "standard", label: "Стандарт" },
    { name: "actions", label: "", width: "100px" },
]
const tableData = [
    {
        id: 1,
        indicator: "Водородный показатель (pH)",
        standard: "ПНД Ф 14.1:2:3:4.121-97",
        tooltip: "Условия хранения: Хранить в прохладном, защищенном от света месте."
    },
    {
        id: 2,
        indicator: "Перманганатная окисляемость",
        standard: "ПНД Ф 14.1:2:4.154-99",
    },
    {
        id: 3,
        indicator: "Жесткость общая",
        standard: "ГОСТ 31954-2012",
    },
];

const PresentationTable = () => {
    const beforeEdit = rowData => {
    }
    const beforeDelete = rowData => {
    }
    const getRowClassName = (index, rowData) => {
        return index % 2 === 0 ? 'pinkRow' : ''
    }
    const getColClassName = (index, header) => {
        return index % 2 === 0 ? 'greenCol' : ''
    }
    return (
        <PresentationSection title="Table">
            <PresentationSectionItem>
                <DlTable
                    highLight={false}
                    tableData={tableData}
                    headers={headers}
                    rowClassName={getRowClassName}
                    colClassName={getColClassName}
                    actions={({ rowData }) => (
                        <TableActions
                            onEdit={() => beforeEdit(rowData)}
                            onDelete={() => beforeDelete(rowData)}
                        />
                    )}
                    indicator={({ rowData}) => (
                        <>{rowData.indicator}</>
                    )}
                />
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationTable

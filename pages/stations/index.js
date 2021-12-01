import st from "./index.module.css";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import StationItem from "../../components/Station/StationItem";
import stationActions from "../../actions/station";
import DlModal from "../../components/Shared/Modal";
import DlInput from "../../components/Shared/Input";
import DlFormItem from "../../components/Shared/FormItem/FormItem";
import DlButton from "../../components/Shared/Button";
import DomNotification from "../../components/Shared/DomNotification";


const StationsPage = () => {
    const dispatch = useDispatch();

    const { stationsList, loader } = useSelector(state => state.station)

    const [addStationModalVisible, setAddStationModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [stationName, setStationName] = useState("")

    useEffect(() => {
        dispatch(stationActions.getAllStations());
    }, [])

    const onAddStation = () => {
        setAddStationModalVisible(true);
    }

    const handleAddStationModalClose = () => {
        setAddStationModalVisible(false);
        setStationName('');
    }

    const onAddStationClicked = () => {
        const obj = {
            name: stationName
        }

        // console.log(obj);

        dispatch(stationActions.addStation(obj, () => {
            DomNotification.success({ title: "Станция успешно добавлен", showClose: true, duration: 5000 });
            setIsLoading(false);
            setAddStationModalVisible(false);
            setStationName('');
        }))
    }

    return (
        <>
            <DlHeadTitle title={`Станции`} />
            <div className={st.title_container}>
                <h1 className={st.title}>Станции</h1>
                <DlButton
                    type="success"
                    onClick={onAddStation}
                    loading={isLoading}
                >
                    <span>Добавить</span>
                </DlButton>
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (stationsList.length === 0 ?
                            <div className={st.no_applications_label}>Станций пока нет</div>
                            :
                            stationsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <StationItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
            <DlModal
                title="Добавление станции"
                shouldCloseOnOverlayClick={false}
                visible={addStationModalVisible}
                onRequestClose={handleAddStationModalClose}
                onSave={onAddStationClicked}
                saving={isLoading}
            >
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.formAddItemInner} label="Введите название станции">
                            <DlInput
                                value={stationName || ""}
                                onChange={(ev) => setStationName(ev.target.value)}
                                placeholder="Название..."
                            />
                        </DlFormItem>
                    </div>
                </div>
            </DlModal>
        </>
    )
}

StationsPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default StationsPage;
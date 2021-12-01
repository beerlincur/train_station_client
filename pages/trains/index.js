import st from "./index.module.css";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import trainActions from "../../actions/train";
import DlModal from "../../components/Shared/Modal";
import DlInput from "../../components/Shared/Input";
import DlFormItem from "../../components/Shared/FormItem/FormItem";
import DlButton from "../../components/Shared/Button";
import DomNotification from "../../components/Shared/DomNotification";
import TrainItem from "../../components/Train/TrainItem";


const TrainsPage = () => {
    const dispatch = useDispatch();

    const { trainsList, loader } = useSelector(state => state.train)

    const [addTrainModalVisible, setAddTrainModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [trainName, setTrainName] = useState("")

    useEffect(() => {
        dispatch(trainActions.getAllTrains());
    }, [])

    const onAddTrain = () => {
        setAddTrainModalVisible(true);
    }

    const handleAddTrainModalClose = () => {
        setAddTrainModalVisible(false);
        setTrainName('');
    }

    const onAddTrainClicked = () => {
        const obj = {
            name: trainName
        }

        dispatch(trainActions.addTrain(obj, () => {
            DomNotification.success({ title: "Поезд успешно добавлен", showClose: true, duration: 5000 });
            setIsLoading(false);
            setAddTrainModalVisible(false);
            setTrainName('');
        }))
    }

    return (
        <>
            <DlHeadTitle title={`Поезда`} />
            <div className={st.title_container}>
                <h1 className={st.title}>Поезда</h1>
                <DlButton
                    type="success"
                    onClick={onAddTrain}
                    loading={isLoading}
                >
                    <span>Добавить</span>
                </DlButton>
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (trainsList.length === 0 ?
                            <div className={st.no_applications_label}>Поездов пока нет</div>
                            :
                            trainsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <TrainItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
            <DlModal
                title="Добавление поезда"
                shouldCloseOnOverlayClick={false}
                visible={addTrainModalVisible}
                onRequestClose={handleAddTrainModalClose}
                onSave={onAddTrainClicked}
                saving={isLoading}
            >
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.formAddItemInner} label="Введите название станции">
                            <DlInput
                                value={trainName || ""}
                                onChange={(ev) => setTrainName(ev.target.value)}
                                placeholder="Название..."
                            />
                        </DlFormItem>
                    </div>
                </div>
            </DlModal>
        </>
    )
}

TrainsPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default TrainsPage;
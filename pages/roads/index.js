import st from "./index.module.css";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from "next/router";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import RoadItem from "../../components/Road/RoadItem";
import roadActions from "../../actions/road";
import DomNotification from "../../components/Shared/DomNotification";
import DlFormItem from "../../components/Shared/FormItem/FormItem";
import DlInput from "../../components/Shared/Input";
import DlModal from "../../components/Shared/Modal";
import DlButton from "../../components/Shared/Button";
import {ROLE} from "../../utils/utils";


const RoadsPage = () => {
    const { push } = useRouter();
    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.user)
    const { roadsList, loader } = useSelector(state => state.road)

    const [addRoadModalVisible, setAddRoadModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [roadName, setRoadName] = useState("")

    useEffect(() => {
        dispatch(roadActions.getAllRoads());
    }, [])

    const onAddRoad = () => {
        setAddRoadModalVisible(true);
    }

    const handleAddRoadModalClose = () => {
        setAddRoadModalVisible(false);
        setRoadName('');
    }

    const onAddRoadClicked = () => {
        const obj = {
            name: roadName
        }

        dispatch(roadActions.addRoad(obj, () => {
            DomNotification.success({ title: "Направление успешно добавлено", showClose: true, duration: 5000 });
            setIsLoading(false);
            setAddRoadModalVisible(false);
            setRoadName('');
        }))
    }

    return (
        <>
            <DlHeadTitle title={`Направления`} />
            <div className={st.title_container}>
                <h1 className={st.title}>Направления</h1>
                {currentUser.role_id === ROLE.admin &&
                    <DlButton
                        type="success"
                        onClick={onAddRoad}
                        loading={isLoading}
                    >
                        <span>Добавить</span>
                    </DlButton>
                }
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (roadsList.length === 0 ?
                            <div className={st.no_applications_label}>Направлений пока нет</div>
                            :
                            roadsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <RoadItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
            <DlModal
                title="Добавление направления"
                shouldCloseOnOverlayClick={false}
                visible={addRoadModalVisible}
                onRequestClose={handleAddRoadModalClose}
                onSave={onAddRoadClicked}
                saving={isLoading}
            >
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.formAddItemInner} label="Введите название направления">
                            <DlInput
                                value={roadName || ""}
                                onChange={(ev) => setRoadName(ev.target.value)}
                                placeholder="Название..."
                            />
                        </DlFormItem>
                    </div>
                </div>
            </DlModal>
        </>
    )
}

RoadsPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default RoadsPage;
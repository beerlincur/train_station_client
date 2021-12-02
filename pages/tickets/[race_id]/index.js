import st from "./index.module.css";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from "next/router";
import ticketActions from "../../../actions/ticket";
import DlHeadTitle from "../../../components/Shared/HeadTitle";
import TicketItemClient from "../../../components/Ticket/TicketItemClient";
import DefaultLayout from "../../../layouts/DefaultLayout";
import DlBreadcrumb from "../../../components/Shared/Breadcrumb";
import {ROLE} from "../../../utils/utils";
import DlButton from "../../../components/Shared/Button";
import roadStationActions from "../../../actions/road_station";
import DomNotification from "../../../components/Shared/DomNotification";
import DlFormItem from "../../../components/Shared/FormItem/FormItem";
import DlSelectAdvanced from "../../../components/Shared/SelectAdvanced";
import DlInput from "../../../components/Shared/Input";
import DlModal from "../../../components/Shared/Modal";


const TicketsByRacePage = () => {
    const { push, query } = useRouter();
    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.user)
    const { ticketsList, loaderTickets } = useSelector(state => state.ticket)
    const { roadStationsList, loaderRoadStations } = useSelector(state => state.roadStation)

    const [addTicketModalVisible, setAddTicketModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [roadId, setRoadId] = useState(-1)
    const [roadStationOptions, setRoadStationOptions] = useState([])
    const [departureRoadStationSelected, setDepartureRoadStationSelected] = useState({})
    const [arrivalRoadStationSelected, setArrivalRoadStationSelected] = useState({})

    const [carNumber, setCarNumber] = useState(-1)
    const [seatNumber, setSeatNumber] = useState(-1)

    useEffect(() => {
        if (query.race_id) {
            dispatch(ticketActions.getTicketsByRace(query.race_id));
        }
    }, [query.race_id])

    useEffect(() => {
        if (query.race_id) {
            dispatch(roadStationActions.getByRace(query.race_id, (roadId) => {
                setRoadId(roadId)
            }))
        }
    }, [query.race_id])

    useEffect(() => {
        if (roadStationsList) {
            setRoadStationOptions(roadStationsList.map(rs => {
                return { value: rs.road_station_id, label: rs.station.name }
            }))
        }
    }, [roadStationsList])

    const onAddTicket = () => {
        setAddTicketModalVisible(true);
    }

    console.log(roadId)

    const handleTicketModalClose = () => {
        setAddTicketModalVisible(false);
        setDepartureRoadStationSelected({});
        setArrivalRoadStationSelected({});
        setCarNumber(-1)
        setSeatNumber(-1)
    }

    const onAddTicketClicked = () => {
        const obj = {
            road_id: roadId,
            departure_station_id: departureRoadStationSelected.value,
            arrival_station_id: arrivalRoadStationSelected.value,
            car_number: carNumber,
            seat_number: seatNumber,
            is_bought: false,
            is_in_train: false,
            race_number: query.race_id
        }

        dispatch(ticketActions.addTicket(obj, () => {
            DomNotification.success({ title: "Билет успешно добавлен", showClose: true, duration: 5000 });
            setIsLoading(false);
            setAddTicketModalVisible(false);
            setDepartureRoadStationSelected({});
            setArrivalRoadStationSelected({});
            setCarNumber(-1)
            setSeatNumber(-1)
        }))
    }

    return (
        <>
            <DlHeadTitle title={`Билеты на рейс #${query.race_id}`} />
            <div className={st.title_container}>
                <div className={st.main}>
                    <DlBreadcrumb
                        currentIndex={2}
                        items={[
                            { index: 1, title: "Рейсы", path: '/' },
                            { index: 2, title: `Билеты на рейс #${query.race_id}` }
                        ]}
                    />
                    <h1 className={st.title}>Билеты на рейс #{query.race_id}</h1>
                </div>
                {currentUser.role_id === ROLE.admin &&
                <DlButton
                    type="success"
                    onClick={onAddTicket}
                    loading={isLoading}
                >
                    <span>Добавить билет на рейс</span>
                </DlButton>
                }
            </div>
            <div className={st.applicationsList}>
                {loaderTickets ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (ticketsList.length === 0 ?
                            <div className={st.no_applications_label}>Билетов пока нет</div>
                            :
                            ticketsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <TicketItemClient {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
            <DlModal
                title="Добавление билета"
                shouldCloseOnOverlayClick={false}
                visible={addTicketModalVisible}
                onRequestClose={handleTicketModalClose}
                onSave={onAddTicketClicked}
                saving={isLoading}
            >
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.form_mt} label="Выбор станции отправления">
                            <DlSelectAdvanced
                                onSelect={el => {
                                    setDepartureRoadStationSelected(el)
                                }}
                                placeholder={"Выберите станцию из списка..."}
                                value={departureRoadStationSelected}
                                options={roadStationOptions}
                                emptyMessage="Нет станций"
                                isClearable />
                        </DlFormItem>
                    </div>
                </div>
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.form_mt} label="Выбор станции прибытия">
                            <DlSelectAdvanced
                                onSelect={el => {
                                    setArrivalRoadStationSelected(el)
                                }}
                                placeholder={"Выберите станцию из списка..."}
                                value={arrivalRoadStationSelected}
                                options={roadStationOptions}
                                emptyMessage="Нет станций"
                                isClearable />
                        </DlFormItem>
                    </div>
                </div>
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.formAddItemInner} label="Номер вагона">
                            <DlInput
                                value={carNumber}
                                onChange={(ev) => setCarNumber(ev.target.value)}
                                placeholder="Номер вагона..."
                            />
                        </DlFormItem>
                    </div>
                </div>
                <div className={st.formAdd}>
                    <div className={st.formAddItem}>
                        <DlFormItem className={st.formAddItemInner} label="Номер места">
                            <DlInput
                                value={seatNumber}
                                onChange={(ev) => setSeatNumber(ev.target.value)}
                                placeholder="Номер места..."
                            />
                        </DlFormItem>
                    </div>
                </div>
            </DlModal>
        </>
    )
}

TicketsByRacePage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default TicketsByRacePage;
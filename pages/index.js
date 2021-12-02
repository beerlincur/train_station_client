import DefaultLayout from "../layouts/DefaultLayout";
import { useRouter } from "next/router";
import DlHeadTitle from "../components/Shared/HeadTitle";
import st from "./index.module.css";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import raceActions from "../actions/race";
import RaceItemClient from "../components/Ticket/RaceItemClient";
import DomNotification from "../components/Shared/DomNotification";
import DlFormItem from "../components/Shared/FormItem/FormItem";
import DlModal from "../components/Shared/Modal";
import DlButton from "../components/Shared/Button";
import roadStationActions from "../actions/road_station";
import roadActions from "../actions/road";
import DlSelectAdvanced from "../components/Shared/SelectAdvanced";
import stationActions from "../actions/station";
import trainActions from "../actions/train";
import DlInput from "../components/Shared/Input";


const IndexPage = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { racesList, loaderRaces } = useSelector(state => state.race)
    const { roadsList, loaderRoads } = useSelector(state => state.road)
    const { stationsList, loaderStations } = useSelector(state => state.station)
    const { trainsList, loaderTrains } = useSelector(state => state.train)

  const [addRoadStationModalVisible, setAddRoadStationModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

    const [roadOptions, setRoadOptions] = useState([])
    const [roadSelected, setRoadSelected] = useState(-1)

    const [stationOptions, setStationOptions] = useState([])
    const [stationSelected, setStationSelected] = useState(-1)

    const [trainOptions, setTrainOptions] = useState([])
    const [trainSelected, setTrainSelected] = useState(-1)

    const [numInRoad, setNumInRoad] = useState(0)
    const [arrivalTime, setArrivalTime] = useState("")
    const [departureTime, setDepartureTime] = useState("")
    const [raceNumber, setRaceNumber] = useState(0)


  useEffect(() => {
    dispatch(raceActions.getAllRaces());
  }, [])

    useEffect(() => {
        dispatch(roadActions.getAllRoads());
    }, [])

    useEffect(() => {
        if (roadsList) {
            setRoadOptions(roadsList.map(r => {
                return { value: r.road_id, label: r.name }
            }))
        }
    }, [roadsList])

    useEffect(() => {
        dispatch(stationActions.getAllStations())
    }, [])

    useEffect(() => {
        if (stationsList) {
            setStationOptions(stationsList.map(s => {
                return { value: s.station_id, label: s.name }
            }))
        }
    }, [stationsList])

    useEffect(() => {
        dispatch(trainActions.getAllTrains())
    }, [])

    useEffect(() => {
        if (trainsList) {
            setTrainOptions(trainsList.map(s => {
                return { value: s.train_id, label: s.name }
            }))
        }
    }, [trainsList])


  const onAddRoadStation = () => {
      setAddRoadStationModalVisible(true);
  }

  const handleAddRoadStationModalClose = () => {
      setAddRoadStationModalVisible(false);
      setRoadSelected(-1);
      setStationSelected(-1);
      setTrainSelected(-1);
  }

  const onAddRoadStationClicked = () => {
      const obj = {
          road_id: roadSelected.value,
          station_id: stationSelected.value,
          train_id: trainSelected.value,
          num_in_road: numInRoad,
          arrival_time: arrivalTime,
          departure_time: departureTime,
          race_number: raceNumber
      }

      dispatch(roadStationActions.addRoadStation(obj, () => {
          DomNotification.success({ title: "Станция маршрута успешно добавлен", showClose: true, duration: 5000 });
          setIsLoading(false);
          setAddRoadStationModalVisible(false);
          setRoadSelected(-1);
          setStationSelected(-1);
          setTrainSelected(-1);
      }))
  }

  return (
      <>
        <DlHeadTitle title="Рейсы" />
        <div className={st.title_container}>
          <h1 className={st.title}>Рейсы</h1>
            <DlButton
                type="success"
                onClick={onAddRoadStation}
                loading={isLoading}
            >
                <span>Добавить станцию маршрута</span>
            </DlButton>
        </div>
        <div className={st.applicationsList}>
          {loaderRaces ?
              <div className={st.no_applications_label}>Загрузка...</div>
              :
              (racesList.length === 0 ?
                      <div className={st.no_applications_label}>Рейсов пока нет</div>
                      :
                      racesList.map((item, i) => {
                        return (
                            <div key={i} className={st.applicationsItem}>
                                <RaceItemClient {...item}/>
                            </div>
                        )
                      })
              )
          }
        </div>
      <DlModal
          title="Добавление станции маршрута"
          shouldCloseOnOverlayClick={false}
          visible={addRoadStationModalVisible}
          onRequestClose={handleAddRoadStationModalClose}
          onSave={onAddRoadStationClicked}
          saving={isLoading}
      >
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.form_mt} label="Выбор направления">
                      <DlSelectAdvanced
                          onSelect={el => {
                              setRoadSelected(el)
                          }}
                          placeholder={"Выберите направление из списка..."}
                          value={roadSelected}
                          options={roadOptions}
                          emptyMessage="Нет направлений"
                          isClearable />
                  </DlFormItem>
              </div>
          </div>
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.form_mt} label="Выбор станции">
                      <DlSelectAdvanced
                          onSelect={el => {
                              setStationSelected(el)
                          }}
                          placeholder={"Выберите станцию из списка..."}
                          value={stationSelected}
                          options={stationOptions}
                          emptyMessage="Нет станций"
                          isClearable />
                  </DlFormItem>
              </div>
          </div>
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.form_mt} label="Выбор поезда">
                      <DlSelectAdvanced
                          onSelect={el => {
                              setTrainSelected(el)
                          }}
                          placeholder={"Выберите поезд из списка..."}
                          value={trainSelected}
                          options={trainOptions}
                          emptyMessage="Нет поездов"
                          isClearable />
                  </DlFormItem>
              </div>
          </div>
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.formAddItemInner} label="Введите номер по счету станции в маршруте">
                      <DlInput
                          value={numInRoad || -1}
                          onChange={(ev) => setNumInRoad(ev.target.value)}
                          placeholder="Номер по счету..."
                      />
                  </DlFormItem>
              </div>
          </div>
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.formAddItemInner} label="Введите время прибытия на станцию">
                      <DlInput
                          value={arrivalTime || -1}
                          onChange={(ev) => setArrivalTime(ev.target.value)}
                          placeholder="Время прибытия..."
                      />
                  </DlFormItem>
              </div>
          </div>
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.formAddItemInner} label="Введите отбытия со станции">
                      <DlInput
                          value={departureTime || -1}
                          onChange={(ev) => setDepartureTime(ev.target.value)}
                          placeholder="Время отбытия..."
                      />
                  </DlFormItem>
              </div>
          </div>
          <div className={st.formAdd}>
              <div className={st.formAddItem}>
                  <DlFormItem className={st.formAddItemInner} label="Номер рейса">
                      <DlInput
                          value={raceNumber || -1}
                          onChange={(ev) => setRaceNumber(ev.target.value)}
                          placeholder="Номер рейса..."
                      />
                  </DlFormItem>
              </div>
          </div>
      </DlModal>
      </>
  )
}

IndexPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default IndexPage;
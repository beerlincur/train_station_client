import DefaultLayout from "../layouts/DefaultLayout";
import { useRouter } from "next/router";
import DlHeadTitle from "../components/Shared/HeadTitle";
import st from "./index.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import raceActions from "../actions/race";
import RaceItemClient from "../components/Ticket/RaceItemClient";


const IndexPage = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { racesList, loader } = useSelector(state => state.race)

  console.log(`loader index: ${loader}`)

  useEffect(() => {
    dispatch(raceActions.getAllRaces());
  }, [])

  return (
      <>
        <DlHeadTitle title="Рейсы" />
        <div className={st.title_container}>
          <h1 className={st.title}>Рейсы</h1>
        </div>
        <div className={st.applicationsList}>
          {loader ?
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
      </>
  )
}

IndexPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default IndexPage;
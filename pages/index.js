import DefaultLayout from "../layouts/DefaultLayout";
import ApplicationItem from "../components/Applications/ApplicationItem";
import ApplicationItemCourier from "../components/Applications/ApplicationItemCourier";
import { useRouter } from "next/router";
import DlHeadTitle from "../components/Shared/HeadTitle";
import st from "./index.module.css";
import DlButton from "../components/Shared/Button";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApplicationItemAdmin from "../components/Applications/ApplicationItemAdmin";
import ticketActions from "../actions/ticket";


const IndexPage = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { ticketsList, loader } = useSelector(state => state.ticket)

  useEffect(() => {
    dispatch(ticketActions.getAllTickets());
  }, [])

  return (
      <>
        <DlHeadTitle title="Билеты" />
        <div className={st.title_container}>
          <h1 className={st.title}>Билеты</h1>
        </div>
        <div className={st.applicationsList}>
          {loader ?
              <div className={st.no_applications_label}>Загрузка...</div>
              :
              (ticketsList.length === 0 ?
                      <div className={st.no_applications_label}>Билетов пока нет</div>
                      :
                      ticketsList.map((item, i) => {
                        return (
                            <div key={i} className={st.applicationsItem}>
                              {/*<Item {...item} />*/}
                                <p>hello</p>
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
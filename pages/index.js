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
import {ROLE} from "../utils/utils";


const IndexPage = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const { applicationsList, loader } = useSelector(state => state.application);
  const { currentUser } = useSelector(state => state.user);

  const currentRole = currentUser && currentUser.role;

  useEffect(() => {
    dispatch(ticketActions.getAllTickets());
  }, [])

  let Item
  switch (currentRole) {
    case ROLE.individual:
      Item = ApplicationItem
      break;
    case ROLE.admin:
      Item = ApplicationItemAdmin
      break;
    default:
      Item = () => <div style={{ display: 'none' }} />
      break;
  }
  return (
      <>
        <DlHeadTitle title="Заявки" />
        <div className={st.title_container}>
          <h1 className={st.title}>Заявки</h1>
        </div>
        <div className={st.applicationsList}>
          {loader ?
              <div className={st.no_applications_label}>Загрузка...</div>
              :
              (applicationsList.length === 0 ?
                      <div className={st.no_applications_label}>Заявок пока нет</div>
                      :
                      applicationsList.map((item, i) => {
                        return (
                            <div key={i} className={st.applicationsItem}>
                              <Item {...item} />
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
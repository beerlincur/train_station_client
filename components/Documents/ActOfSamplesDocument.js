import {useRouter} from "next/router";
import {useEffect} from "react";
import applicationActions from "../../actions/application";
import {useDispatch, useSelector} from "react-redux";
import cx from "classnames";
import st from "./Documents.module.css"
import {convertDate, getDisplyedPhoneNumber} from "../../utils/utils";

const ActOfSamplesDocument = () => {
    const { query } = useRouter();
    const dispatch = useDispatch();

    const { application } = useSelector(state => state.application);
    const applicationId = application && application.id;

    useEffect(() => {
        if (query.applicationId) {
            dispatch(applicationActions.getApplicationById(query.applicationId));
        }
    }, [query.applicationId])


    return (
        applicationId &&
        <>
            <div className={st.header}>
                <div className={st.centered}>
                    <h1>Акт отбора проб</h1>
                    <h3>№ {application.number} от {convertDate(application.created_at, { format: 'dd LLL yyyy'})}</h3>
                </div>
                <div>
                    <img id="application-qr-code" className={st.righted} alt="QR-код" width="200" height="200" src={`https://storage.yandexcloud.net/dokuchaevlab/application/${applicationId}.svg`}/>
                </div>
            </div>

            <table className={cx(st.table, st.fullsize)}>
                <caption className={st.tableCaption}><b>Информация о заказчике:</b></caption>
                <tbody>
                    <tr>
                        <td><b>Наименование организации</b></td>
                        <td>{application.profile.company_name || "-"}</td>
                        <td><b>ИНН (ОГРН):</b> {application.profile.tax_number || "-"}<br/> (для ЮЛ, ИП)
                        </td>
                    </tr>

                    <tr>
                        <td><b>Юридический и фактический адреса</b></td>
                        <td colSpan="2">{application.profile.address || "-"}</td>
                    </tr>

                    <tr>
                        <td><b>Контактное лицо (ФИО)</b></td>
                        <td>{application.profile.last_name} {application.profile.first_name} {application.profile.middle_name || ""}</td>
                        <td><b>Телефон:</b> {getDisplyedPhoneNumber(application.profile.phone)}<br/>
                            <b>Email:</b> {application.profile.email || "-"}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className={cx(st.table, st.fullsize)}>
                <caption className={st.tableCaption}><b>Общая информация о пробе:</b></caption>
                <tbody>
                    <tr>
                        <td><b>Объект испытаний</b></td>
                        <td>
                            {/*<table className={cx(st.table, st.noBorders, st.noMarBot)}>*/}
                            {/*    <tbody>*/}
                            {/*        <tr>*/}
                            {/*            <td>*/}
                            {/*                ☐ - Вода питьевая*/}
                            {/*            </td>*/}
                            {/*            <td>*/}
                            {/*                ☐ - Вода природная*/}
                            {/*            </td>*/}
                            {/*            <td>*/}
                            {/*                ☐ - Вода сточная*/}
                            {/*            </td>*/}
                            {/*            <td>*/}
                            {/*                ☐ - Вода бассейна*/}
                            {/*            </td>*/}
                            {/*        </tr>*/}
                            {/*        <tr>*/}
                            {/*            <td>*/}
                            {/*                ✓ - Почва, грунт*/}
                            {/*            </td>*/}
                            {/*            <td>*/}
                            {/*                ☐ - Донные отложения*/}
                            {/*            </td>*/}
                            {/*            <td colSpan="2">*/}
                            {/*                ☐ - Другое:*/}
                            {/*            </td>*/}
                            {/*        </tr>*/}
                            {/*    </tbody>*/}
                            {/*</table>*/}
                            {application.research_object.title}
                        </td>
                        <td/>
                    </tr>

                    <tr>
                        <td><b>Наименование объекта отбора пробы</b></td>
                        <td>{application.research_object.title}</td>
                        <td/>
                    </tr>

                    <tr>
                        <td><b>Адрес отбора проб</b></td>
                        <td>{application.address}</td>
                        <td/>
                    </tr>

                    <tr>
                        <td><b>Дата и время отбора</b></td>
                        <td>{convertDate(application.sampling_report_submit_time, { format: 'dd LLL yyyy'})}</td>
                        <td><b>Метеоусловия:</b> {application.samples_taking_conditions || "-"}</td>
                    </tr>

                    <tr>
                        <td><b>Цель испытаний, нормативный документ, определяемые показатели</b></td>
                        <td><b>Производственный контроль, сответствие требованиям ПП №514 от 27.07.2014 по показателям:</b>
                            <br/>
                            {application.markers.map((m, i) => <p key={i}>{i + 1}. {m.title}</p>)}
                        </td>
                        <td/>
                    </tr>

                    <tr>
                        <td><b>Метод (вид) отбора</b></td>
                        <td>{application.samples[0] && (application.samples[0].method === "hand" ? "Ручной" : "Автоматический")}</td>
                        <td><b>Тип пробы:</b> {application.samples[0] && (application.samples[0].type === "point" ? "Точечная" : "Комплексная")}</td>
                    </tr>
                </tbody>
            </table>

            <table className={st.table}>
                <caption className={st.tableCaption}><b>Информация об условиях отбора, транспортировке и хранении:</b></caption>
                <tbody>
                    <tr>
                        <th>№ п/п</th>
                        <th>Маркировка тары (№ пломбы)</th>
                        <th>Точка отбора пробы</th>
                        <th>Материал тары</th>
                        <th>Кол-во, объем пробы (дм3, кг)</th>
                        <th>Примечания</th>
                    </tr>
                    {application.samples.map((s, i) =>
                        <tr key={i}>
                            <th>№ {i + 1}</th>
                            <th>{s.marking}</th>
                            <th>{s.place}</th>
                            <th>{s.sample_container || "-"}</th>
                            <th>{(s.volume || "-") + " " + s.unit}</th>
                            <th>{s.preparation || "-"}</th>
                        </tr>
                    )}
                </tbody>
            </table>

            <table className={cx(st.table, st.noBorders)}>
                <caption className={st.tableCaption}><b>Ответственный за отбор пробы:</b></caption>
                <tbody>
                    <tr>
                        <td>Инженер ООО «ПИР-инжиниринг»<br/>
                            Должность
                        </td>
                        <td> {application.courier ?
                            (application.courier.last_name + " " + application.courier.first_name + " " + (application.courier.middle_name || ""))
                            : "_____________________"}<br/>
                            ФИО
                        </td>
                        <td> _____________________<br/>
                            Подпись

                        </td>
                    </tr>
                </tbody>
            </table>

            <table className={cx(st.table, st.noBorders)}>
                <caption className={st.tableCaption}><b>Ответственный за доставку пробы:</b></caption>
                <tbody>
                    <tr>
                        <td>Инженер ООО «ПИР-инжиниринг»<br/>
                            Должность
                        </td>
                        <td> {application.courier ?
                            (application.courier.last_name + " " + application.courier.first_name + " " + (application.courier.middle_name || ""))
                            : "_____________________"}<br/>
                            ФИО
                        </td>
                        <td> _____________________<br/>
                            Подпись

                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default ActOfSamplesDocument
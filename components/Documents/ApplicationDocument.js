import {useRouter} from "next/router";
import {useEffect} from "react";
import applicationActions from "../../actions/application";
import {useDispatch, useSelector} from "react-redux";
import cx from "classnames";
import st from "./Documents.module.css"
import {convertDate, getDisplyedPhoneNumber} from "../../utils/utils";

const ApplicationDocument = () => {
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
                    <h1>ЗАЯВКА НА ПРОВЕДЕНИЕ ИСПЫТАНИЙ</h1>
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
                <caption className={st.tableCaption}><b>Общая информация:</b></caption>
                <tbody>
                    <tr>
                        <td><b>Сопроводительный документ</b></td>
                        <td>-</td>
                    </tr>

                    <tr>
                        <td><b>Объект испытаний</b></td>
                        <td colSpan="2">
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
                    </tr>

                    <tr>
                        <td><b>Наименование пробы / объекта отбора проб</b></td>
                        <td>{application.research_object.title}</td>
                    </tr>

                    <tr>
                        <td><b>Адрес объекта<br/>отбора проб</b></td>
                        <td>{application.address}</td>
                    </tr>

                    <tr>
                        <td><b>Цель испытаний (НД) </b></td>
                        <td>Производственный контроль, сответствие нормам СанПиН 1.2.4.3685-21*</td>
                    </tr>

                    <tr>
                        <td colSpan="2"><b>Определяемые показатели</b> (Комплексные наборы испытаний)*:
                            {application.markers.map((m, i) => <p key={i}>{i + 1}. {m.title}</p>)}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>• Заказчик (представитель) уведомлен и согласен на проведение исследований проб вне зависимости от
                соблюдения им
                условий отбора и транспортирования проб, и подтверждает согласие на право выбора исполнителем
                оптимальных методов
                исследований.</p>

            <table className={st.table}>
                <caption className={st.tableCaption}><b>Информация о условия отбора, транспортировке и хранении:</b></caption>
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

            <table className={cx(st.table, st.noRules)}>
                <tbody>
                    <tr>
                        <td><b>Ответственный за отбор пробы:</b>
                        </td>
                        <td>Инженер ООО «ПИР-инжиниринг»<br/>
                            (Должность)
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
                    <tr>
                        <td><b>Дата и время отбора проб:</b>
                        </td>
                        <td> {convertDate(application.sampling_report_submit_time, { format: 'dd LLL yyyy'})}
                        </td>
                        <td colSpan="2"> {convertDate(application.sampling_report_submit_time, { format: 'hh'})} часов {convertDate(application.sampling_report_submit_time, { format: 'mm'})} минут.
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className={cx(st.table, st.noRules)}>
                <tbody>
                    <tr>
                        <td colSpan="3"><b>Пробы принял:</b> инженер ООО «ПИР-инжиниринг» Лыткин Н.А.:
                        </td>
                    </tr>
                    <tr>
                        <td><b>Дата и время отбора проб:</b>
                        </td>
                        <td> {convertDate(application.sampling_report_submit_time, { format: 'dd LLL yyyy'})}
                        </td>
                        <td> {convertDate(application.sampling_report_submit_time, { format: 'hh'})} часов {convertDate(application.sampling_report_submit_time, { format: 'mm'})} минут.
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default ApplicationDocument
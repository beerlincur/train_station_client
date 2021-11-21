import {useRouter} from "next/router";
import {useEffect} from "react";
import applicationActions from "../../actions/application";
import {useDispatch, useSelector} from "react-redux";
import cx from "classnames";
import st from "./Documents.module.css"
import {convertDate} from "../../utils/utils";

const ResultsDocument = () => {
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
                    <h1>РЕЗУЛЬТАТЫ ИСПЫТАНИЙ</h1>
                    <h3>№ {application.number} от {convertDate(application.created_at, { format: 'dd LLL yyyy'})}</h3>
                </div>
                <div>
                    <img id="application-qr-code" className={st.righted} alt="QR-код" width="200" height="200" src={`https://storage.yandexcloud.net/dokuchaevlab/application/${applicationId}.svg`}/>
                </div>
            </div>

            <table className={cx(st.table, st.fullsize)}>
                <caption className={st.tableCaption}><b>Общая информация:</b></caption>
                <tbody>
                    <tr>
                        <td><b>Заказчик</b></td>
                        <td>{application.profile.company_name || "-"}</td>
                    </tr>

                    <tr>
                        <td><b>Объект испытаний</b></td>
                        <td>{application.research_object.title}</td>
                    </tr>

                    <tr>
                        <td><b>Наименование пробы/ объекта отбора проб </b></td>
                        <td>{application.research_object.title}</td>
                    </tr>
                    <tr>
                        <td><b>Адрес (место /точка) отбора пробы</b></td>
                        <td>{application.address}</td>
                    </tr>
                    <tr>
                        <td><b>Период проведения испытаний</b></td>
                        <td>{convertDate(application.sampling_report_submit_time, { format: 'dd LLL yyyy'})}</td>
                    </tr>
                </tbody>
            </table>

            <table className={cx(st.table, st.fullsize)}>
                <caption className={st.tableCaption}><b>Документы для анализа:</b></caption>
                <tbody>
                    <tr>
                        <td><b>1</b></td>
                        <td>Протокол № 96/1-В от 06.04.2021, выдан ИЛЦ ФГБНУ Почвенного института им. В.В. Докучаева</td>
                    </tr>

                    <tr>
                        <td><b>2</b></td>
                        <td>Протокол № ВД-02838.001 от 06.04.2021, выдан ИЛЦ ФГБУЗ ГЦГиЭ ФМБА России</td>
                    </tr>

                    <tr>
                        <td><b>3</b></td>
                        <td>Заявка на проведение исследований проб № 28968-20 от 19.02.2020</td>
                    </tr>
                    <tr>
                        <td><b>4</b></td>
                        <td>Акт отбора проб проб № 28968-20 от 19.02.2020</td>
                    </tr>
                </tbody>
            </table>

            <table className={cx(st.table, st.fullsize)}>
                <caption className={st.tableCaption}><b>Информация по результатам исследования пробы:</b></caption>
                <tbody>
                    <tr>
                        <th>Определяемый показатель</th>
                        <th>Результат измерения</th>
                        <th>Нормативное<br/>значение*</th>
                        <th>Единицы<br/>измерения</th>
                        <th>Нормативный документ<br/>на методику</th>
                    </tr>
                    {application.results.map((r, i) =>
                        <tr key={i}>
                            <th>{r.marker.title}</th>
                            <th>{r.value}</th>
                            <th>{
                                (r.marker.norm_from ? `От: ${r.marker.norm_from} ` : "")
                                +
                                (r.marker.norm_to ? `До: ${r.marker.norm_to} ` : " ")
                                +
                                (r.marker.norm_text ? `Текст: ${r.marker.norm_text}` : "")
                            }</th>
                            <th>{r.marker.unit}</th>
                            <th>{r.marker.method_standard.title}</th>
                        </tr>
                    )}
                </tbody>
            </table>

            <p>* СанПиН 1.2.4.3685-21 (Нормативы качества и безопасности воды).</p>
            <p>В столбце «Результат измерения» <span className={st.colorRed}>выделены</span> значения, которые превышают
                установленные нормативным документом уровни содержания соответствующих веществ или элементов. Результаты
                исследования распространяются только на указанную пробу. Передача документа третьим лицам, а также его
                полное
                или частичное копирование без разрешения ООО «МИП Почвенного института им. В.В. Докучаева» и
                согласования с
                Заказчиком не допускается.</p>

            <table className={cx(st.table, st.fullsize, st.backGreen)}>
                <tbody>
                    <tr>
                        <td><b>Выводы:</b> проба воды по исследованным санитарно-химическим показателям <b>не
                            соответствует</b>
                            СанПиН 1.2.4.3685-21 "Гигиенические нормативы и требования к обеспечению безопасности и (или)
                            безвредности для человека факторов среды обитания". В пробе обнаружены превышения норм по
                            показателям:
                            <b>Жесткость</b>, <b>Мутность</b>, <b>Железо</b>, <b>ОМЧ</b>, <b>ОКБ</b>.
                        </td>
                    </tr>
                </tbody>
            </table>

            <p>Если Вам требуется дополнительная консультация по результатам анализа или рекомендации по водоподготовке,
                просим
                связаться с нами по телефону - <b>8 (495) 120–67–97</b>, или почте: <b>info@mip-esoil.ru.</b></p>

            <table className={cx(st.table, st.fullsize, st.noRules)}>
                <tbody>
                    <tr>
                        <td><b>Эксперт, <br/>
                            ООО «МИП Почвенного института им. В.В. Докучаева»</b></td>
                        <td> {application.analyzers ? application.analyzers : "_____________________"}<br/>
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

export default ResultsDocument
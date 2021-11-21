import jsCookie from 'js-cookie'
import { DateTime } from 'luxon'
import { TOKEN_NAME } from './constants'
import _ from 'lodash'
/**
 * Is Valid Phone Number
 * @param {String} number +79990009900
 * @returns Boolean
 */
export const isValidNumber = number => {
    return !!number && number.length === '79990009900'.length
}


export const replaceMaskWithNumber = (str = "") => {
    // return str.replace(/[^\d.+]/g, '')
    return str.replace(/[^\d]/g, '')
}

/**
 *
 * @param {String} token _
 * @returns Object
 */
export const getTokenConfig = (token= null) => {
    let customToken = token;
    if (!token) {
        if (process.browser) {
            customToken = jsCookie.get(TOKEN_NAME)
        }
    }
    const opts = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (!!customToken) {
        opts.headers["Authorization"] = 'Bearer ' + customToken
    }
    return opts
}

export const fillZero = time => time < 10 ? '0' + time : time

export const formatCodeTime = (time) => {
    // cut off except hh:mm:ss
    let minutes = 0;
    let seconds = time;
    if (time > 59) {
        seconds = time % 60;
        minutes = (time - seconds) / 60;
    }
    return `${fillZero(minutes)}:${fillZero(seconds)}`
}

export const STATUS = {
    accepted: 'accepted',
    from_client: 'from_client',
    to_client: 'to_client',
    courier_selection: 'courier_selection',
    delivery: 'delivery',
    analysis: 'analysis',
    finished: 'finished',
    canceled: 'canceled'
}

export const ROLE = {
    individual: 'individual',
    company: 'company',
    laboratory: 'laboratory',
    assistant: 'assistant',
    courier: 'courier',
    admin: 'admin',
}

export const STATUS_TAGS = [
    {
        status: STATUS.accepted,
        color: 'success',
        courierColor: "warning",
        label: "Принята",
        courierLabel: "Клиент ожидает Вас",
        laboratoryLabel: "Принята",
        adminLabel: "Принята",
        dark: false,
        courierDark: true,
    },
    {
        status: STATUS.from_client,
        color: 'warning',
        courierColor: "warning",
        label: "Ожидаем пробы от Вас",
        courierLabel: "Ожидаем пробы от клиента",
        laboratoryLabel: "Ожидаем пробы от клиента",
        adminLabel: "Ожидаем пробы от клиента",
        dark: true,
        courierDark: true,
    },
    {
        status: STATUS.to_client,
        color: 'warning',
        courierColor: "warning",
        label: "Курьер идёт к Вам",
        courierLabel: "Клиент ожидает Вас",
        laboratoryLabel: "Курьер идёт к клиенту",
        adminLabel: "Курьер идёт к клиенту",
        dark: true,
        courierDark: true,
    },
    {
        status: STATUS.courier_selection,
        color: 'warning',
        courierColor: "warning",
        label: "Назначение курьера",
        courierLabel: "Назначение курьера",
        laboratoryLabel: "Назначение курьера",
        adminLabel: "Назначение курьера",
        dark: true,
        courierDark: true,
    },
    {
        status: STATUS.delivery,
        color: 'warning',
        courierColor: "",
        label: "Курьер идёт в лабораторию",
        courierLabel: "Лаборатория ожидает Вас",
        laboratoryLabel: "Курьер идёт к Вам",
        adminLabel: "Курьер идёт в лабораторию",
        dark: true,
        courierDark: true,
    },
    {
        status: STATUS.analysis,
        color: 'warning',
        courierColor: "",
        label: "В лаборатории",
        courierLabel: "Идёт анализ",
        laboratoryLabel: "Идёт анализ",
        adminLabel: "Идёт анализ",
        dark: true,
        courierDark: true,
    },
    {
        status: STATUS.finished,
        color: 'success',
        courierColor: "",
        label: "Выполнена",
        courierLabel: "Выполнена",
        laboratoryLabel: "Выполнена",
        adminLabel: "Выполнена",
        dark: false,
        courierDark: false,
    },
    {
        status: STATUS.canceled,
        color: 'error',
        courierColor: "",
        label: "Отменена",
        courierLabel: "Отменена",
        laboratoryLabel: "Отменена",
        adminLabel: "Отменена",
        dark: false,
        courierDark: false,
    },
]

export const getDisplyedPhoneNumber = phone => {
    if (!phone) return ""
    let cPhone = phone;
    if (typeof phone !== "string") {
        if (typeof phone === 'number') {
            cPhone = phone.toString()
        } else {
            return phone
        }
    }
    if (cPhone.length !== 11) return `+${cPhone}`
    return `+${cPhone.slice(0, 1)} ${cPhone.slice(1, 4)} ${cPhone.slice(4, 7)}-${cPhone.slice(7, 9)}-${cPhone.slice(9, 11)}`
}

export const getUserInitials = user => {
    let initials = ""
    if (user.first_name)
        initials += user.first_name[0]
    if (user.last_name)
        initials += user.last_name[0]
    return initials;
}

export const isValidDate = date => {
    return !!date && date instanceof Date && date.toString() !== "Invalid Date";
}


export const isToday = date => {
    const d = new Date()
    return isValidDate(date) && (d.getFullYear() === date.getFullYear()) && (d.getMonth() === date.getMonth()) && (d.getDate() === date.getDate())
}

const isYesterday = date => {
    const d = new Date(new Date().setHours(0, 0, -1))
    return (d.getFullYear() === date.getFullYear()) && (d.getMonth() === date.getMonth()) && (d.getDate() === date.getDate())
}

export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return isValidDate(d1) && isValidDate(d2) && (d1.getFullYear() === d2.getFullYear()) && (d1.getMonth() === d2.getMonth()) && (d1.getDate() === d2.getDate())
}

export const isDifferentDate = (index, list) => {
    if (!_.isNumber(index) || _.isEmpty(list)) {
        return true;
    }
    const current = list[index]
    const isTodayDate = isToday(new Date(current.createdAt))
    if (isTodayDate) {
        return index === 0
    }
    const prev = list[index - 1]
    if (!prev) return true
    return !isSameDay(current.createdAt, prev.createdAt)
}
/**
 *
 * @param {Date, String} date date
 * @param {Object} opts hours: Boolean, day: Boolean, format: String
 * @returns String
 */
export const convertDate = (date, opts = { hours: true, day: false }) => {
    const hours = opts.hours
    const day = opts.day
    const val = new Date(date)
    if (!isValidDate(val)) return "Invalid Date";
    let format = 'dd LLL yyyy';

    if (day) {
        format = `ccc, ${format}`
    }

    if (isToday(val)) {
        format = hours ? 'Сегодня в HH:mm' : 'Сегодня'
    }
    if (isYesterday(val)) {
        format = hours ? 'Вчера в HH:mm' : 'Вчера'
    }

    if (opts.format) {
        format = opts.format
    }

    const dt = DateTime.fromISO(val.toISOString(), { locale: 'ru' })

    return dt.toFormat(format)
}

export const customizeStatusTag = (tag, role) => {
    if (!tag) return {}
    return {
        ...tag,
        label: tag[`${role}Label`] || tag.label,
        color: tag[`${role}Color`] || tag.color,
        dark: tag[`${role}Dark`] || tag.dark,
    }
}

const isEmailAddress = email => {
    return !!email && /^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$/.test(email);
}

const isValidPhone = phone => {
    return !!phone && phone.length >= 11;
}

export const schemaValidator = (obj, schema) => {
    const schemaKeys = Object.keys(schema);
    const errObj = {}
    for (const item of schemaKeys) {
        const validations = schema[item];
        const value = obj[item];
        for (const validation of validations) {
            if (validation.required && !value) {
                errObj[item] = validation.required || 'Обязательное поле!'
                break;
            }
            if (validation.email && !isEmailAddress(value)) {
                errObj[item] = validation.email || 'Не валидный почтовый адрес!'
                break;
            }
            if (validation.phone && !isValidPhone(value)) {
                console.log(`value`, value)
                errObj[item] = validation.phone || 'Не валидный телефон!'
                break;
            }
        }
    }
    return errObj;
}

export const sampleSchema = {
    marking: [
        { required: 'Обязательное поле!' }
    ],
    place: [
        { required: 'Обязательное поле!' }
    ],
    volume: [
        { required: 'Обязательное поле!' }
    ],
    sample_container: [
        { required: 'Обязательное поле!' }
    ],
}

export const scrollToElement = (element, offset = 50) => {
    if (!process.browser) return
    const top = (element && _.isNumber(element.offsetTop)) ? element.offsetTop : 600;
    window.scroll({ left: 0, top: top - offset, behavior: 'smooth' });
}

export const getNormDisplayValue = (from, to) => {
    let displayNorm = "—"
    if (!isNaN(parseFloat(from))) {
        displayNorm = isNaN(parseFloat(to)) ? `> ${from}` : `${from} — ${to}`
    }
    if (!isNaN(parseFloat(to)) && isNaN(parseFloat(from))) {
        displayNorm = `< ${to}`
    }
    return displayNorm
}
export function openBase64NewTab(base64Pdf) {
    let blob = base64toBlob(base64Pdf);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, "report.pdf");
    } else {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    }
}

function base64toBlob(base64Data) {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize;
        const end = Math.min(begin + sliceSize, bytesLength);

        const bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: "application/pdf" });
}

export const reportTypes = {
    act_of_samples: "act_of_samples",
    results: "results",
    application: "application"
}

export const headersResults = [
    { name: "index", label: "№", width: "30px" },
    { name: "marking", label: "Маркировка", },
    { name: "marker", label: "Показатель", width: "230px" },
    { name: "unit", label: "Ед. изм", width: "100px" },
    { name: "value", label: "Результат" },
    { name: "norm", label: "Норма", nowrap: true },
    { name: "norm_standard", label: "Стандарт на объект", width: "200px" },
    { name: "actions", label: "" },
];

export const sampleHeaders = [
    { name: "index", label: "№", width: "30px" },
    { name: "marking", label: "Маркировка пробы" },
    { name: "place", label: "Точка отбора", width: "110px" },
    { name: "volume", label: "Кол-во" },
    { name: "unit", label: "Ед. изм" },
    { name: "sample_container", label: "Тара" },
    { name: "time", label: "Дата/Время" },
    { name: "method", label: "Метод сбора" },
    { name: "type", label: "Тип пробы", width: "87px" },
    { name: "preparation", label: "Подготовка проб", width: "100px" },
    { name: "actions", label: "", width: "100px" },
];

export const methodOptions = [
    { value: "hand", label: "Ручной" },
    { value: "auto", label: "Автоматический" },
]
export const typeOptions = [
    { value: "point", label: "Точечная" },
    { value: "composite", label: "Составная" },
]

export const paymentTypeToWord = {
    cash: "Наличные",
    card: "Картой курьеру",
    online: "Картой онлайн"
}

export const paymentType = {
    cash: "cash",
    card: "card",
    online: "online"
};

export const samplingType = {
    customer: "customer",
    courier: "courier",
    customer_samples: "customer_samples"
};

export const headersMarkers = [
    { name: "index", label: "№", width: "30px" },
    { name: "indicator", label: "Показатель", minWidth: 250 },
    { name: "standard", label: "Стандарт", minWidth: 200 }
];

export const sampleProtocolHeaders = [
    { name: "index", label: "№", width: "30px" },
    { name: "marking", label: "Маркировка пробы", width: "170px" },
    { name: "place", label: "Точка отбора", width: "130px" },
    { name: "volume", label: "Кол-во" },
    { name: "unit", label: "Ед. изм" },
    { name: "status", label: "Статус" },
];

export const markersTableHeaders = [
    { name: "index", label: "№", width: "30px" },
    { name: "title", label: "Показатель", width: "230px" },
    { name: "norm_standard", label: "Стандарт на объект", width: "200px" },
    { name: "assistant", label: "Сотрудник", width: "250px" },
    // { name: "value", label: "Результат" },
    // { name: "unit", label: "Ед. изм", width: "100px" },
    // { name: "norm", label: "Норма", nowrap: true },
    { name: "actions", label: "" },
];


export const getResultsTableData = (application) => {
    if (!application || !_.isArray(application.results)) return []
    return application.results.map((item, index) => {
        return {
            index: index + 1,
            ...item,
            marking: _.get(item, "sample.marking", "—"),
            unit: _.get(item, "marker.unit", "—"),
            norm_standard: item.marker,
            norm: getNormDisplayValue(_.get(item, "marker.norm_from"), _.get(item, "marker.norm_to")),
        }
    })
}

export const getResultClassName = (index, tableData, successClass, errorClass) => {
    const data = tableData[index]
    const value = data && +data.value;
    if (!value || isNaN(value)) return ""
    const from = _.get(data, "norm_standard.norm_from")
    const to = _.get(data, "norm_standard.norm_to")
    if ((_.isNumber(from) && value < from) || (_.isNumber(to) && value > to)) {
        return errorClass
    }
    return successClass
}

export const makeAssignLoadingId = (applicationId, markerId) => {
    if (!applicationId || !markerId) return null
    return `app-${applicationId}-marker-${markerId}`
}

export const labelizeAssistant = assistant => {
    return {
        user: assistant,
        label: `${assistant.first_name ? (assistant.first_name + " ") : ""}${assistant.last_name || ""}`,
        value: assistant.id,
    }
}
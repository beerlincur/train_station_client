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

export const ROLE = {
    client: 1,
    conductor: 2,
    admin: 3
}

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
    if (user.second_name)
        initials += user.second_name[0]
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
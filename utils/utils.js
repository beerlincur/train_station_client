import jsCookie from 'js-cookie'
import { TOKEN_NAME } from './constants'

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
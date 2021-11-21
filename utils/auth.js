import jwtDecode from 'jwt-decode'

const decodeToken = (token) => {
    let decoded
    try {
        decoded = jwtDecode(token)
    } catch (e) {
        return null
    }
    return decoded
}

const tokenHasValidData = (dtkn) => !!(dtkn && dtkn.sub && dtkn.exp)

const isTokenExpired = (decodedToken) => {
    return (
        decodedToken &&
        decodedToken.exp &&
        Date.now() > new Date(decodedToken.exp * 1000).getTime()
    )
}

export const isValidToken = (token) => {
    const dcdTkn = decodeToken(token)
    return tokenHasValidData(dcdTkn) && !isTokenExpired(dcdTkn)
}
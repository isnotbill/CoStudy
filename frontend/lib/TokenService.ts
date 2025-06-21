let accessToken: string | null = null
export const getToken = () => accessToken
export const setToken = (t: string | null) => {accessToken = t}

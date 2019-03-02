import axios from 'axios'

const baseUrl = 'https://api.foursquare.com/v2/'
const defaultParams = {
    v: 20180323,
    client_id: 'BYNG5WLA13RD3Q3F43WYHFLLIBPQAALRW2RCIULDZWJWMGN5',
    client_secret: 'YP0OFHYEAI0O1QKWQC4GHC4R4FLBHBS30MQW54KZIRSY4WLW'
}

export const getApi = (url, params) => axios.get(
    `${baseUrl}${url}`,
    { params: { ...defaultParams, ...params } }
)

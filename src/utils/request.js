import axios from 'axios';
const service = axios.create({
    timeout: 1500,
    baseURL: 'http://10.216.1.184:8091'
})
export default service
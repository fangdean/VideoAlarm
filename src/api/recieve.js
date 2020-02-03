import request from '@/utils/request'

const group_name = 'sendConfig'
export default {
    sendConfig(pojo) {
        return request({
            url: `/${group_name}/sendConfig`,
            method: 'post',
            data: pojo
        })
    },
    sendFile(pojo) {
        return request({
            url: `/${group_name}/sendFile`,
            method: 'post',
            data: pojo
        })
    },
    getCameraList() {
        return request({
            url: `/${group_name}/getCameraList`,
            method: 'get'
        })
    }
}
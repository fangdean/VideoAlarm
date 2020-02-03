<template>
    <div>
        安全管控平台
        <div style="width: 60%;margin-left: 20%;display: flex;flex-direction: column;text-align: left;box-shadow: 0 2px 4px rgba(0, 0, 0, .5), 0 0 6px rgba(0, 0, 0, .04);padding: 10px;">
            <div style="padding: 8px;">任务ID</div>
            <el-input v-model="pojo.taskId" style="width: 50%;"></el-input>
            <div style="padding: 8px;">任务类型</div>
            <el-select v-model="pojo.taskType" placeholder="请选择任务类型" style="width: 50%;">
                <el-option v-for="item in typeOption" :label="item.name" :value="item.value"
                           :key="item.value"></el-option>
            </el-select>
            <div style="padding: 8px;">任务开始时间</div>
            <el-date-picker
                    v-model="pojo.taskStartTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyyMMddHHmm"
                    placeholder="选择任务开始时间">
            </el-date-picker>
            <div style="padding: 8px;">任务结束时间</div>
            <el-date-picker
                    v-model="pojo.taskStopTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyyMMddHHmm"
                    placeholder="选择任务结束时间">
            </el-date-picker>
            <div style="padding: 8px;">请选择摄像头编号</div>
            <el-select v-model="ids" multiple placeholder="请选择订阅的摄像头" style="width: 50%;">
                <el-option
                        v-for="item in cameraList"
                        :key="item.cameraId"
                        :label="item.cameraName"
                        :value="item.cameraId">
                </el-option>
            </el-select>
            <el-button type="success" style="width: 200px;margin-top: 10px;" @click="submit()">发送订阅</el-button>
        </div>
        <div style="width: 60%;margin-left: 20%;display: flex;flex-direction: column;text-align: left;box-shadow: 0 2px 4px rgba(0, 0, 0, .5), 0 0 6px rgba(0, 0, 0, .04);padding: 10px;margin-top: 10px;">
            <div style="padding: 8px;">人员编号</div>
            <el-input v-model="userInfoPojo.userID" style="width: 50%;"></el-input>
            <div style="padding: 8px;">报警图片</div>
            <el-upload
                    ref="upload"
                    action="string"
                    style="width: 50%;"
                    multiple
                    :limit="1"
                    :file-list="fileList"
                    :http-request="UploadImage"
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <br>
                <el-button style="margin-left: 0px;margin-top: 10px;" size="small" type="success"
                           @click="uploadUserInfo">上传到服务器
                </el-button>
            </el-upload>
        </div>
        <div style="width: 60%;margin-left: 20%;margin-top: 20px;box-shadow: 0 2px 4px rgba(0, 0, 0, .5), 0 0 6px rgba(0, 0, 0, .04);padding: 10px;margin-top: 10px;">
            <div style="padding: 10px;">报警信息</div>
            <el-table
                    :data="alarmInfoList"
                    style="width: 100%;">
                <el-table-column prop="taskId" label="任务ID"></el-table-column>
                <el-table-column prop="alarmTime" label="告警时间"></el-table-column>
                <el-table-column prop="enumDataType" label="报警类型" :formatter="typeFormatter"></el-table-column>
                <el-table-column prop="url" label="报警图片">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.url" style="width: 100px;height: 100px;"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="报警内容"></el-table-column>
            </el-table>
        </div>
        <div style="width: 60%;margin-left: 20%;margin-top: 20px;box-shadow: 0 2px 4px rgba(0, 0, 0, .5), 0 0 6px rgba(0, 0, 0, .04);padding: 10px;margin-top: 10px;">
            <div style="padding: 10px;">设备台账</div>
            <el-table
                    :data="deviceList"
                    style="width: 100%;">
                <el-table-column prop="camerId" label="摄像头编号"></el-table-column>
                <el-table-column prop="camerName" label="摄像头名称"></el-table-column>
                <el-table-column prop="ipAddress" label="摄像头IP"></el-table-column>
                <el-table-column prop="camerLocation" label="摄像头位置"></el-table-column>
                <el-table-column prop="status" label="摄像头状态" :formatter="statusFormatter"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import recieveApi from '@/api/recieve';

    export default {
        name: "SafeControl",
        data() {
            return {
                pojo: {},
                typeOption: [
                    {
                        value: 0,
                        name: '新增'
                    },
                    {
                        value: 1,
                        name: '更新'
                    },
                    {
                        value: 2,
                        name: '删除'
                    }
                ],
                cameraList: [],
                ids: [],
                alarmInfoList: [],
                deviceList: [],
                userInfoPojo: {},
                fileList: []
            }
        },
        //页面创建时建立连接
        created() {
            this.initWebSocket();
            this.loadData();
        },
        //页面销毁时关闭连接
        destroyed() {
            this.websock.close();
        },
        methods: {
            loadData() {
                recieveApi.getCameraList()
                    .then(response => {
                        var ret = response.data;
                        this.cameraList = ret.retData;
                        // eslint-disable-next-line no-console
                        console.log(JSON.stringify(ret));
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    });
            },
            typeFormatter(row, column) {
                // eslint-disable-next-line no-console
                console.log(column.index)
                var typeName = '';
                //0:未佩戴安全帽,1:未穿工装,2:未佩戴安全帽和未穿工装，3人脸识别比对成功，4 安全围栏越界，5 安全围栏倒伏 6 工装半袖
                switch (row.enumDataType) {
                    case '0':
                        typeName = '未佩戴安全帽';
                        break;
                    case '1':
                        typeName = '未穿工装';
                        break;
                    case '2':
                        typeName = '未佩戴安全帽和未穿工装';
                        break;
                    case '3':
                        typeName = '人脸识别比对成功';
                        break;
                    case '4':
                        typeName = '安全围栏越界';
                        break;
                    case '5':
                        typeName = '安全围栏倒伏';
                        break;
                    case '6':
                        typeName = '工装半袖';
                        break;
                    default:
                        typeName = '未定义类型';
                        break;
                }
                return typeName;
            },
            statusFormatter(row, column) {
                // eslint-disable-next-line no-console
                console.log(column.index)
                var statusName = '';
                if (row.status == '0') {
                    statusName = '未开';
                } else if (row.status == '1') {
                    statusName = '已开';
                } else if (row.status == '2') {
                    statusName = '毁坏';
                }
                return statusName;
            },
            uploadUserInfo() {
                this.$refs.upload.submit();
            },
            UploadImage(param) {
                alert(param.file);
                const formData = new FormData();
                formData.append("file", param.file);
                formData.append("userID", this.userInfoPojo.userID);
                recieveApi.sendFile(formData)
                    .then(response => {
                        alert(response.data);
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    })
            },
            submit() {
                var list = [];
                for (let i = 0; i < this.ids.length; i++) {
                    list.push({camerId: this.ids[i]});
                }
                this.pojo.taskAreaList = list;
                recieveApi.sendConfig(this.pojo)
                    .then(response => {
                        var ret = response.data;
                        // eslint-disable-next-line no-console
                        console.log(ret)
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    });
            },
            //websocket相关方法
            initWebSocket() {
                var wsuri = "ws://10.216.1.184:8091" + "/websocket";
                this.websock = new WebSocket(wsuri);
                this.websock.onopen = this.websocketonopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen() {
            },
            websocketonmessage(e) {
                //此处如果eNodeBId对应上重新获取，否则不管
                // var dataType = JSON.parse(e.data);
                var dataType = e.data;
                if (dataType.type == 1) {
                    this.alarmInfoList.push(dataType.data);
                } else if (dataType.type == 2) {
                    for (let i = 0; i < dataType.data.cameraInfoList.length; i++) {
                        this.deviceList.push(dataType.data.cameraInfoList[i]);
                    }
                }
                // eslint-disable-next-line no-console
                console.log(JSON.stringify(dataType));
            },
            websocketonerror(e) {
                // eslint-disable-next-line no-console
                console.log("socket 出现问题" + e.name)
            },
            websocketclose(e) {
                // eslint-disable-next-line no-console
                console.log(e.name)
            },
            websocketsend(agentData) {
                this.websock.send(agentData);
            },
        }
    }
</script>

<style scoped>

</style>
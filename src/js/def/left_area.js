import { OD, ST } from './odef.js'
import { TOPIC } from './topic_def.js'

let leftCount = {}

leftCount[TOPIC.VEHICLE_BY_AREA] = {
  type: OD.VEHICLE,
  groupName: ST.AREA,
  label: {
    group: ['区域', '车辆'],
    detail: ['车牌', '司机', '速度', '操作']
  }
}

leftCount[TOPIC.STAFF_BY_DEPT] = {
  type: OD.STAFF,
  groupName: ST.DEPT,
  label: {
    group: ['部门', '人数'],
    detail: ['姓名', '入井时间', '', '操作']
  }
}

leftCount[TOPIC.STAFF_BY_AREA] = {
  type: OD.STAFF,
  groupName: ST.AREA,
  label: {
    group: ['区域', '人数'],
    detail: ['姓名', '入井时间', '', '操作']
  }
}

leftCount[TOPIC.STAFF_BY_LEVEL] = {
  type: OD.STAFF,
  groupName: ST.LEVEL,
  label: {
    group: ['岗位', '人数'],
    detail: ['姓名', '入井时间', '', '操作']
  }
}

export default leftCount

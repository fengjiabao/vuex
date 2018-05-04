// 地图左侧列表的相关定义
const TOPIC = {
  VEHICLE_BY_AREA: 'vehicleByArea',
  STAFF_BY_DEPT: 'staffByDept',
  STAFF_BY_AREA: 'staffByArea',
  STAFF_BY_LEVEL: 'staffByLevel',
  COAL_FACE: 'coalface',
  DRIVING_FACE: 'drivingface',
  CALL_LIST: 'callList',
  READER_LIST: 'readerList',
  PATROL_LIST: 'patrolList',
  HELP_ME_LIST: 'helpList',
  LIGHTS_LIST: 'lightsList'
}

let TopicDef = {}
TopicDef[TOPIC.VEHICLE_BY_AREA] = {
  name: TOPIC.VEHICLE_BY_AREA,
  iconName: 'icon-bus-vehicle',
  label: '车辆按区域分布',
  tagName: 'group-list', // topic 对应的 tag 名称
  class: 'active',
  path: './topic-panel'
}
TopicDef[TOPIC.STAFF_BY_DEPT] = {
  name: TOPIC.STAFF_BY_DEPT,
  iconName: 'icon-person',
  label: '人员按部门分布',
  tagName: 'group-list',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.STAFF_BY_AREA] = {
  name: TOPIC.STAFF_BY_AREA,
  iconName: 'icon-area-staff',
  label: '人员按区域分布',
  tagName: 'group-list',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.STAFF_BY_LEVEL] = {
  name: TOPIC.STAFF_BY_LEVEL,
  iconName: 'icon-job-staff',
  label: '人员按岗位分布',
  tagName: 'group-list',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.COAL_FACE] = {
  name: TOPIC.COAL_FACE,
  iconName: 'icon-hoist',
  label: '综采面',
  tagName: 'coal-face',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.DRIVING_FACE] = {
  name: TOPIC.DRIVING_FACE,
  iconName: 'icon-crane',
  label: '掘进面',
  tagName: 'driving-face',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.CALL_LIST] = {
  name: TOPIC.CALL_LIST,
  iconName: 'icon-megaphone-1',
  label: '人员呼叫',
  tagName: 'call-personnel',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.READER_LIST] = {
  name: TOPIC.READER_LIST,
  iconName: 'icon-bstation',
  label: '分站列表',
  tagName: 'reader-list',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.PATROL_LIST] = {
  name: TOPIC.PATROL_LIST,
  iconName: 'icon-cogs',
  label: '巡检列表',
  tagName: 'patrol-list',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.HELP_ME_LIST] = {
  name: TOPIC.HELP_ME_LIST,
  iconName: 'icon-help-car',
  label: '呼救列表',
  tagName: 'help-side-list',
  class: '',
  path: './topic-panel'
}
TopicDef[TOPIC.LIGHTS_LIST] = {
  name: TOPIC.LIGHTS_LIST,
  iconName: 'icon-traffic-light',
  label: '红绿灯列表',
  tagName: 'lights-list',
  class: '',
  path: './topic-panel'
}
export { TOPIC, TopicDef }

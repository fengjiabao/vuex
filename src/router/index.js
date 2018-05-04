import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login'
import middleView from '@/middle/monitor/sp_monitor'
import historyIndex from '@/middle/history/sp-history'
import reportIndex from '@/middle/report/sp-report'
import manageIndex from '@/middle/manage/sp-manage'
import configIndex from '@/middle/config/sp-config'
import main from '@/view/main'
// import sideBar from '@/middle/monitor/map-sidebar'
import topicPanel from '@/middle/monitor/topic-panel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        {
          path: '/middle/monitor/sp_monitor',
          component: middleView,
          redirect: '/middle/monitor/topic-panel', // 路由重定向，即默认显示某一个路由地址
          children: [
            {path: '/middle/monitor/topic-panel', component: topicPanel}
          ]
        },
        {path: '/middle/history/sp-history', component: historyIndex},
        {path: '/middle/report/sp-report', component: reportIndex},
        {path: '/middle/manage/sp-manage', component: manageIndex},
        {path: '/middle/config/sp-config', component: configIndex}
      ]
    }
  ]
})

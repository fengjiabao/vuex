import Vue from 'vue'
import Router from 'vue-router'
import Login from '../view/login'
import main from '../view/main'

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
      component: main
    }
  ]
})

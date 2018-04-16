import io from 'socket.io-client'
import { EVT, CMD } from './Protocol.js'

const url = '127.0.0.1:9000'
const connectionOpts = {
  // "force new connection": true,
  'reconnectionAttempts': 'Infinity', // avoid having user reconnect manually in order to prevent dead clients after a server restart
  'timeout': 10000, // 10s, before connect_error and connect_timeout are emitted.
  'transports': ['websocket']
}

export default class Socket {
  constructor () {
    this.socket = io(url, connectionOpts)
    window.xsocket = this.socket
    this.registerSocketEventHandlers()
  }

  getConnection (timeout) {
    let self = this
    return new Promise((resolve, reject) => {
      if (self.socket && self.socket.connected) {
        console.log('Socket.getConnection: Aready connected.')
        resolve(self.socket)
      } else {
        console.log('Socket.getConnection: Socket do NOT connect.')
      }

      // set our own timeout in case the socket ends some other way than what we are listening for
      let timer = setTimeout(function () {
        timer = null
        error('Socket.getConnection: local timeout.')
      }, timeout)

      // common error handler
      function error (data) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        reject(data)
      }

      // success
      self.socket.on('connect', () => {
        clearTimeout(timer)
        resolve(self.socket)
      })

      // errors
      self.socket.on('connect_error', error)
      self.socket.on('connect_timeout', error)
      self.socket.on('error', error)
      self.socket.on('disconnect', (error) => {
        console.log(error)
      })

      // here reconnect to remote
      self.socket.connect() // 这里是异步
    })
  }

  registerSocketEventHandlers () {
    this.socket.on('connect', () => {
      console.log('Socket connected')
    })
    // Fired upon an attempt to reconnect.
    this.socket.on('reconnecting', function (number) {
      console.log('Trying to reconnect to the server... ', number)
    })

    // Fired upon a successful reconnection.
    this.socket.on('reconnect', function (number) {
      console.log('Reconnect succeed : ', number)
    })

    // Fired upon a connection error
    this.socket.on('error', function (error) {
      console.warn('Connection error : ', error)
    })

    this.socket.on('META', (res) => {
      let cmd = res.cmd
      switch (cmd) {
        case CMD.META.META_DEF:
          xdata.commit('metaStore/saveMetaDef', res)
          break
        case CMD.META.DATA:
          xdata.dispatch('metaStore/metaData', res)
          break
      }
    })
  }
}

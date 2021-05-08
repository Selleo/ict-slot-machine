import React from 'react'
import Roller from './Roller'
import socketIOClient from 'socket.io-client'
import { resultResponse } from '../modules/result'
import { ToastContainer, toast } from 'react-toastify'

const ROLLERS = ['left', 'center', 'right']

export default class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.socket = socketIOClient('http://localhost:3000')

    ROLLERS.forEach(roller => {
      this[roller] = React.createRef()
    })
  }

  componentDidMount() {
    this.socket.on('SPIN_REQUEST', forcedSpinTo => this._spinMachine(forcedSpinTo))
    this.socket.on('NOTIFY', (type, message) => toast[type](message))
  }

  _spinMachine(forcedSpinTo) {
    const spins = ROLLERS.map(roller => this[roller].current.spin(this.state[roller], forcedSpinTo))

    Promise.all(spins).then(results => {
      const state = Object.values(results).reduce((a, v) => ({ ...a, ...v }), {})
      this.setState(state)

      this.socket.emit('SPIN_ENDED', resultResponse(state))
    })
  }

  _createRollers() {
    return ROLLERS.map(roller => (
      <Roller
        key={roller}
        ref={this[roller]}
        position={roller}
        height={170}
        width={210}
        count={10}
      />
    ))
  }

  render() {
    return (
      <div className="rollers">
        <div style={{background:'hotpink',position:'absolute',zIndex:'1333',top:'50px',left: '50%'}}><button onClick={()=>this.socket.emit('SPIN_REQUEST')}>test</button></div>
        <ToastContainer autoClose={5000} position={toast.POSITION.TOP_CENTER} />
        <div className="overlay" />
        {this._createRollers()}
      </div>
    )
  }
}

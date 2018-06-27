import React from 'react'
import Roller from './Roller'
import socketIOClient from 'socket.io-client'
import { logResult } from '../modules/result'

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
    this.socket.on('SPIN_REQUEST', () => this._spinMachine())
  }

  _spinMachine() {
    const spins = ROLLERS.map(roller => this[roller].current.spin(this.state[roller]))

    Promise.all(spins).then(results => {
      const state = Object.values(results).reduce((a, v) => ({ ...a, ...v }), {})
      this.setState(state)

      logResult(state)

      this.socket.emit('SPIN_ENDED', state)
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
        count={12}
      />
    ))
  }

  render() {
    return (
      <div className="rollers">
        <div className="overlay" />
        {this._createRollers()}
      </div>
    )
  }
}

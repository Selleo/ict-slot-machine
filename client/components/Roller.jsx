import React from 'react'
import { createRoot } from 'react-dom/client'
import Slot from './Slot'
import Animation from './Animation'
import Polygon, { getR } from '../modules/polygon'
import { random, times } from 'lodash-es'

export default class Roller extends React.Component {
  constructor(props) {
    super(props)

    this.polygon = new Polygon(props.height, props.count)
    this.spin = this.spin.bind(this)
  }

  componentDidMount() {
    const { position } = this.props
    const container = document.querySelector(`.styles-roller-${position}`)
    this.root = createRoot(container)
  }

  spin(startingIndex = 0, forcedSpinTo) {
    return new Promise(resolve => {
      const { count, position } = this.props
      let rotations = random(30, 50)

      if (isFinite(forcedSpinTo)) {
        rotations = 3 * count + forcedSpinTo - startingIndex
      }

      document.querySelector(`.roller.${position}`).addEventListener(
        'animationend',
        () => {
          resolve({ [position]: (startingIndex + rotations) % count })
        },
        { once: true }
      )

      this.root.render(
        <Animation
          startingIndex={startingIndex}
          position={position}
          rotations={rotations}
          angle={this.polygon.angle}
        />
      )
    })
  }

  _createSlots() {
    return times(this.props.count, number => {
      return <Slot key={number} polygon={this.polygon} number={number} />
    })
  }

  _getRollerStyles() {
    const { width, height, count } = this.props

    return {
      transformOrigin: `0 50% -${getR(height, count)}px`,
      width: `${width}px`,
      height: `${height}px`
    }
  }

  render() {
    const { position } = this.props

    return (
      <div className={`roller-wrapper ${position}`}>
        <div className={`styles-roller-${position}`} />

        <div className={`roller ${position}`} style={this._getRollerStyles()}>
          {this._createSlots()}
        </div>
      </div>
    )
  }
}

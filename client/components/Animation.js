import React from 'react'
import random from 'lodash/random'

export default class Animation extends React.Component {
  _setAnimation(position) {
    const rollerElement = document.querySelector(`.roller.${position}`)
    rollerElement.classList.remove('animate')
    rollerElement.offsetWidth // reflow hack
    rollerElement.classList.add('animate')
  }

  render() {
    const { position, rotations, angle, startingIndex } = this.props

    const startingRotationInDegree = startingIndex * angle
    const rotationInDegree = startingRotationInDegree + rotations * angle
    const animationTime = random(3, 6, true)
    const offset = random(1, 7)

    const animation = `roller-${position} ${animationTime}s ease forwards`

    this._setAnimation(position)

    return (
      <style>
        {`@keyframes roller-${position} {` +
          `0% { transform: rotateX(${startingRotationInDegree}deg); } ` +
          `90% { transform: rotateX(${rotationInDegree + offset}deg); } ` +
          `100% { transform: rotateX(${rotationInDegree}deg); } }` +
          `.roller.animate.${position}{ animation: ${animation}; }`}
      </style>
    )
  }
}

import React from 'react'

class Slot extends React.Component {

  _getStyles() {
    const { polygon, number } = this.props
    const { translateZ, translateY, rotateX } = polygon.valuesFor(number)

    return {
      transform: `translateZ(${translateZ}px) translateY(${translateY}px) rotateX(${rotateX}deg)`
    }
  }

  _getIcon() {
    return require(`../images/icon-${this.props.number}.png`)
  }

  render() {
    return (
      <div style={this._getStyles()} className='slot'>
        <img src={ this._getIcon() } />
      </div>
    )
  }
}

export default Slot

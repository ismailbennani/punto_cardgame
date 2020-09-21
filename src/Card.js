import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Card.css'

import Global from './Global.js'

class Card extends Component {
  static propTypes = {
    card: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    kind: PropTypes.oneOf([
      "show",
      "open",
      "hidden",
    ]).isRequired,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    x: -1,
    y: -1,
    onClick: () => null,
  }

  render () {
    const { card, color, x, y, kind, onClick } = this.props
    return (
      <div className={`card ${kind}`}
           style={{ width: Global.CARD_SIZE+"px",
                    height: Global.CARD_SIZE+"px",
                    color }}
           onClick={() => onClick({ x, y })}>
        <div className="cardContent">
          {card}
        </div>
      </div>
    )
  }
}

export default Card

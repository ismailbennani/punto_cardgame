import React from 'react'
import PropTypes from 'prop-types'

import './Card.css'

import Global from './Global.js'

function Card ({ card, color, x, y, kind, onClick }) {
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

Card.propTypes = {
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

Card.defaultProps = {
  x: -1,
  y: -1,
  onClick: () => null,
}

export default Card

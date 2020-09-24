import React from "react";
import PropTypes from 'prop-types'

import Global from "./Global.js";
import Card from "./Card.js";

function no_click() { }

function Board ({ board: { dimx, dimy, board }, player_color, onClick }) {
  const board_dimx = dimx * Global.CARD_SIZE
  const board_dimy = dimy * Global.CARD_SIZE
  return <div
    className="board"
    style={{ width: board_dimx + "px", height: board_dimy + "px" }}
  >
    {board.map(({ card, player, x, y, kind }, idx) => {
      return (
        <Card
          card={card}
          color={
            player === -1 ? "white" : player_color[player]
          }
          x={x}
          y={y}
          kind={kind}
          onClick={
            kind === "hidden" ? no_click : onClick
          }
          key={idx}
        />
      );
    })}
  </div>
}

Board.propTypes = {
  board: PropTypes.shape({
    dimx: PropTypes.number,
    dimy: PropTypes.number,
    board: PropTypes.array,
  }).isRequired,
  player_color: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Board

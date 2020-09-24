import React from "react";
import useFitText from "use-fit-text";
import PropTypes from "prop-types";

import './Scoreboard.css'

import Card from "./Card.js";

function Scoreboard({ player_scores, player_color, width }) {
  const { fontSize1, ref1 } = useFitText();
  const { fontSize2, ref2 } = useFitText();

  if (player_scores.map((scores) => scores.length > 0).includes(true)) {
    const board_padding = 20;
    const board_margin = 10;
    const board_width = width - board_padding - 2 * board_margin;
    return (
      <div className="scoreboard" style={{ width: width + "px" }}>
        <h4>Score</h4>
        <ul style={{ paddingLeft: board_padding + "px" }}>
          {player_scores.map((scores, idx) => (
            <li key={idx}>
              <div
                ref={ref1}
                className="playerName"
                style={{ fontSize: fontSize1, width: board_width / 5 + "px" }}
              >
                Player {idx}:
              </div>
              <div
                className="scores"
                style={{
                  width: (7 * board_width) / 10 + "px",
                  marginLeft: board_margin + "px",
                }}
              >
                {scores.map((score, idx2) => (
                  <Card
                    card={score}
                    color={player_color[idx]}
                    kind="show"
                    key={idx2}
                  />
                ))}
              </div>
              <div
                className="totalScore"
                ref={ref2}
                style={{
                  fontSize: fontSize2,
                  width: board_width / 10 + "px",
                  marginLeft: board_margin + "px",
                }}
              >
                {scores.length > 1 && "= " + scores.reduce((acc, v) => acc + v)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } else return null;
}

Scoreboard.propTypes = {
  player_scores: PropTypes.array.isRequired,
  player_color: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
};

export default Scoreboard;

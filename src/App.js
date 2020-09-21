import React, { Component } from "react";
import "./App.css";

import Global from "./Global.js";
import Card from "./Card.js";

/**
 * Shuffles array in place. ES6 version
 * from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rmfirstocc(a, v) {
  var found = true;
  var i;
  for (i = 0; i < a.length; i++) {
    if (a[i] === v) {
      found = true;
      break;
    }
  }
  if (found) {
    return a.filter((v, idx) => idx !== i);
  } else return a;
}

function coord1d2d(idx, dimx, dimy) {
  return {
    x: idx % dimx,
    y: Math.trunc(idx / dimx),
  };
}

function coord2d1d(x, y, dimx, dimy) {
  return y * dimx + x;
}

const DEFAULT_STATE = () => {
  const empty_board = [];
  for (var i = 0; i < (Global.BOARD_DIM + 1) * (Global.BOARD_DIM + 1); i++) {
    const { x, y } = coord1d2d(i, Global.BOARD_DIM + 1, Global.BOARD_DIM + 1);
    empty_board.push({
      card: -1,
      player: -1,
      x: x - Math.trunc(Global.BOARD_DIM / 2),
      y: y - Math.trunc(Global.BOARD_DIM / 2),
      kind: "hidden",
    });
  }

  return {
    n_players: 2,
    cur_player: 0,
    player_color: ["red", "cyan"],
    player_deck: [shuffle([...Global.DECK]), shuffle([...Global.DECK])],
    player_scores: [[], []],
    plays: [],

    // board on screen
    board: {
      dimx: Global.BOARD_DIM + 1,
      dimy: Global.BOARD_DIM + 1,
      minx: -Math.trunc(Global.BOARD_DIM / 2) - 1,
      miny: -Math.trunc(Global.BOARD_DIM / 2) - 1,
      board: empty_board,
    },

    // virtual board, before its width/height reaches board_dim, it is centered
    // on screen
    virtual_board: {
      minx: 0,
      maxx: 0,
      miny: 0,
      maxy: 0,
    },

    won: false,
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE();
  }

  componentDidMount() {
    this.setup();
  }

  reset = () => {
    this.setState(DEFAULT_STATE(), this.setup);
  };

  setup() {
    this.update_board();
    this.setup_decks();
  }

  setup_decks() {
    const decks = this.state.player_deck;

    for (var i = 0; i < this.state.n_players; i++) {
      var deck = decks[i];
      const scores = this.state.player_scores[i];

      for (var score of scores) {
        deck = rmfirstocc(deck, score);
      }

      decks[i] = deck;
    }

    this.setState({ player_decks: decks });
  }

  next_round = () => {
    const scores = this.state.player_scores;
    this.setState(DEFAULT_STATE(), () =>
      this.setState({ player_scores: scores }, this.setup)
    );
  }

  mk_board() {
    const {
      plays,
      virtual_board: { minx, maxx, miny, maxy },
      won,
    } = this.state;

    const board_width = maxx - minx;
    const board_height = maxy - miny;

    const actual_dimx =
      board_width < Global.BOARD_DIM ? Global.BOARD_DIM + 1 : Global.BOARD_DIM;
    const actual_dimy =
      board_height < Global.BOARD_DIM ? Global.BOARD_DIM + 1 : Global.BOARD_DIM;

    const empty_left_size =
      board_width < Global.BOARD_DIM
        ? Math.trunc((Global.BOARD_DIM - board_width) / 2) + 1
        : 0;
    const empty_top_size =
      board_height < Global.BOARD_DIM
        ? Math.trunc((Global.BOARD_DIM - board_height) / 2) + 1
        : 0;

    const actual_minx = minx - empty_left_size;
    const actual_miny = miny - empty_top_size;

    const result = [];
    for (var i = 0; i < actual_dimx * actual_dimy; i++) {
      const { x, y } = coord1d2d(i, actual_dimx, actual_dimy);
      result.push({
        card: -1,
        player: -1,
        x: x + actual_minx,
        y: y + actual_miny,
        kind: "hidden",
      });
    }

    if (!won && (board_width === 0 || board_height === 0)) {
      // no card played yet, minx = maxx = miny = maxy = 0
      const center_x = [];
      if (actual_dimx % 2 === 0) {
        center_x.push(actual_dimx / 2);
        center_x.push(actual_dimx / 2 - 1);
      } else {
        center_x.push((actual_dimx - 1) / 2);
      }

      const center_y = [];
      if (actual_dimy % 2 === 0) {
        center_y.push(actual_dimy / 2);
        center_y.push(actual_dimy / 2 - 1);
      } else {
        center_y.push((actual_dimy - 1) / 2);
      }

      for (var x of center_x) {
        for (var y of center_y) {
          const idx = coord2d1d(x, y, actual_dimx, actual_dimy);
          result[idx].kind = "open";
        }
      }
    }

    for (const { player, card, x, y } of plays) {
      const actual_x = x - actual_minx;
      const actual_y = y - actual_miny;
      const idx = coord2d1d(actual_x, actual_y, actual_dimx, actual_dimy);
      result[idx].card = card;
      result[idx].player = player;
      result[idx].kind = "show";

      if (!won) {
        for (const modx of [-1, 0, 1]) {
          const x = actual_x + modx;
          if (x >= 0 && x < actual_dimx) {
            for (const mody of [-1, 0, 1]) {
              const y = actual_y + mody;
              if (y >= 0 && y < actual_dimy) {
                const idx = coord2d1d(x, y, actual_dimx, actual_dimy);
                if (result[idx].kind === "hidden") {
                  result[idx].kind = "open";
                }
              }
            }
          }
        }
      }
    }

    return {
      dimx: actual_dimx,
      dimy: actual_dimy,
      minx: actual_minx,
      miny: actual_miny,
      board: result,
    };
  }

  update_board() {
    const board = this.mk_board();
    this.setState({ board }, this.win_condition);
  }

  no_click() {}

  board_coord(x, y) {
    const { dimx, dimy, minx, miny } = this.state.board;
    return coord2d1d(x - minx, y - miny, dimx, dimy);
  }

  check_line(x, player, n_consec) {
    const { dimy, miny, board } = this.state.board;

    var n_consecutive = 0;
    var maxn_consecutive = 0;
    var last_col = 0;
    for (var y = miny; y < miny + dimy; y++) {
      const idx = this.board_coord(x, y);
      if (board[idx].player === player) {
        n_consecutive += 1;
      } else {
        maxn_consecutive = Math.max(n_consecutive, maxn_consecutive);
        last_col = y - 1;
        n_consecutive = 0;
      }
    }

    if (maxn_consecutive >= n_consec) {
      const ids = [];
      for (var i = n_consec; i > 0; i--) {
        ids.push(this.board_coord(x, last_col - i + 1));
      }
      const cards = ids.map((id) => board[id].card);
      const best_card = Math.max(...cards);

      return { won: true, best_card };
    }

    return { won: false, best_card: -1 };
  }

  check_col(y, player, n_consec) {
    const { dimx, minx, board } = this.state.board;

    var last_row = 0;
    var maxn_consecutive = 0;
    var n_consecutive = 0;
    for (var x = minx; x < minx + dimx; x++) {
      const idx = this.board_coord(x, y);
      if (board[idx].player === player) {
        n_consecutive += 1;
      } else {
        maxn_consecutive = Math.max(n_consecutive, maxn_consecutive);
        last_row = x - 1;
        n_consecutive = 0;
      }
    }

    if (maxn_consecutive >= n_consec) {
      const ids = [];
      for (var i = n_consec; i > 0; i--) {
        ids.push(this.board_coord(last_row - i + 1, y));
      }
      const cards = ids.map((id) => board[id].card);
      const best_card = Math.max(...cards);

      return { won: true, best_card };
    }

    return { won: false, best_card: -1 };
  }

  win_condition(n_consec = 4) {
    // win_condition is called after each move, we only need to consider
    // the lines, rows and diags involving last play

    if (this.state.plays.length === 0 || this.state.won) return;

    var { player, x, y } = this.state.plays[this.state.plays.length - 1];

    const { won: won1, best_card: best_card1 } = this.check_line(
      x,
      player,
      n_consec
    );
    const { won: won2, best_card: best_card2 } = this.check_col(
      y,
      player,
      n_consec
    );

    const won = won1 || won2;
    const best_card = won1 ? best_card1 : best_card2;

    if (won) {
      const last_player =
        (this.state.cur_player + this.state.n_players - 1) %
        this.state.n_players;
      const player_scores = this.state.player_scores;
      player_scores[last_player].push(best_card);
      this.setState(
        { cur_player: last_player, player_scores, won: true },
        this.update_board
      );
    }
  }

  handle_click = ({ x, y }) => {
    const {
      n_players,
      cur_player,
      player_deck,
      plays,
      virtual_board: { minx, maxx, miny, maxy },
    } = this.state;
    const card = this.get_cur_card();

    var prev_play_idx = -1;
    for (var i = 0; i < plays.length; i++) {
      const play = plays[i];
      if (play.x === x && play.y === y) {
        prev_play_idx = i;
      }
    }

    if (prev_play_idx >= 0) {
      const prev_play = plays[prev_play_idx];
      const prev_card = prev_play.card;
      if (prev_card >= card) return;
    }

    plays.push({ player: cur_player, card, x, y });
    player_deck[cur_player].shift();
    const new_cur_player = (cur_player + 1) % n_players;
    const new_minx = x < minx ? x : minx;
    const new_maxx = x + 1 > maxx ? x + 1 : maxx;
    const new_miny = y < miny ? y : miny;
    const new_maxy = y + 1 > maxy ? y + 1 : maxy;
    this.setState(
      {
        cur_player: new_cur_player,
        player_deck,
        plays,
        virtual_board: {
          minx: new_minx,
          maxx: new_maxx,
          miny: new_miny,
          maxy: new_maxy,
        },
      },
      this.update_board
    );
  };

  get_cur_player = () => this.state.cur_player;

  get_cur_card = () => {
    const cur_player_deck = this.get_cur_deck();
    return cur_player_deck.length > 0 ? cur_player_deck[0] : -1;
  };

  get_cur_deck = () => {
    return this.state.player_deck[this.get_cur_player()];
  };

  get_cur_color = () => this.state.player_color[this.get_cur_player()];

  render() {
    const { dimx, dimy, board } = this.state.board;
    const board_dimx = dimx * Global.CARD_SIZE;
    const board_dimy = dimy * Global.CARD_SIZE;
    const cur_card = this.get_cur_card();
    const cur_color = this.get_cur_color();
    return (
      <div className="punto">
        <header>
          <h1> PUNTO </h1>
          <div className="menu">
            <input type="button" value="Reset" onClick={this.reset} />
          </div>
        </header>
        {board && (
          <div
            className="board"
            style={{ width: board_dimx + "px", height: board_dimy + "px" }}
          >
            {board.map(({ card, player, x, y, kind }, idx) => {
              return (
                <Card
                  card={card}
                  color={
                    player === -1 ? "white" : this.state.player_color[player]
                  }
                  x={x}
                  y={y}
                  kind={kind}
                  onClick={
                    kind === "hidden" ? this.no_click : this.handle_click
                  }
                  key={idx}
                />
              );
            })}
          </div>
        )}
        {this.state.won ? (
          <div className="won" style={{ color: cur_color }}>
            Player {this.get_cur_player()} won! <br />
            <input type="button" value="Next round" onClick={this.next_round} />
          </div>
        ) : (
          <div className="next_card" style={{ width: board_dimx + "px" }}>
            <div>
              <div>Next card:</div>
              <div className="remaining_cards">
                Remaining: {this.get_cur_deck().length}
              </div>
            </div>
            <Card card={cur_card} color={cur_color} kind="show" />
          </div>
        )}
        {this.state.player_scores
          .map((scores) => scores.length > 0)
          .includes(true) && (
          <div className="scoreboard" style={{ width: board_dimx + "px" }}>
            <h4>Score</h4>
            <ul>
              {this.state.player_scores.map((scores, idx) => (
                <li key={idx}>
                  <span className="playerName">Player {idx}:</span>
                  <span className="scores">
                    {scores.map((score, idx2) => (
                      <Card
                        card={score}
                        color={this.state.player_color[idx]}
                        kind="show"
                        key={idx2}
                      />
                    ))}
                  </span>
                  {scores.length > 0 && (
                    <span className="totalScore">
                      = {scores.reduce((acc, v) => acc + v)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default App;

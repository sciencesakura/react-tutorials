import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

type Player = "O" | "X" | null;

namespace Square {
  export interface Props {
    value: Player;
    onClick: () => void;
  }
}

namespace Board {
  export interface Props {
    squares: Player[];
    onClick: (i: number) => void;
  }
}

namespace Game {
  export interface State {
    history: {
      squares: Player[];
    }[];
    stepNumber: number;
    xIsNext: boolean;
  }
}

const Square: React.FC<Square.Props> = (props) => (
  <button className="square" onClick={() => props.onClick()}>
    {props.value}
  </button>
);

class Board extends React.Component<Board.Props> {
  renderSquare(i: number): React.ReactNode {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component<{}, Game.State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        {
          squares: new Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = Array.from(current.squares);
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(stepNumber: number): void {
    this.setState({
      stepNumber,
      xIsNext: stepNumber % 2 === 0,
    });
  }

  render(): React.ReactNode {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((_, move) => {
      const desc = move ? `Go to move #${move}` : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    const state = winner
      ? `Winner: ${winner}`
      : `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{state}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: Player[]): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));

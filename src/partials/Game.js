import { SVG_NS, PADDLE_HEIGHT, PADDLE_Y, PADDLE_WIDTH, PADDLE_GAP, PADDLE_SPEED, KEYS, SCORE_FONT, SCORE_Y, WINNER_FONT, SHOT_WIDTH, SHOT_HEIGHT } from '../settings';
import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';
import Score from './Score';
import Shot from './Shot';
import Winner from './Winner';

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.gameElement = document.getElementById(this.element);
    this.bgElement = document.getElementById(this.bg);
    this.board = new Board(this.width, this.height);

    this.paddle1 = new Paddle(this.height, PADDLE_WIDTH, PADDLE_HEIGHT, this.width - PADDLE_GAP - PADDLE_WIDTH, PADDLE_Y, KEYS.p1Up, KEYS.p1Down, KEYS.p1Shot);
    this.paddle2 = new Paddle(this.height, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_GAP, PADDLE_Y, KEYS.p2Up, KEYS.p2Down, KEYS.p2Shot);

    this.ball1 = new Ball(this.width, this.height, PADDLE_GAP, PADDLE_WIDTH, "#5F45ED");
    this.ball2 = new Ball(this.width, this.height, PADDLE_GAP, PADDLE_WIDTH, "#FCDA4B");
    this.paused = false;

    this.score1 = new Score(this.width / 2 + 35, SCORE_Y, SCORE_FONT);
    this.score2 = new Score(this.width / 2 - 60, SCORE_Y, SCORE_FONT);

    this.shot1 = new Shot(SHOT_WIDTH, SHOT_HEIGHT, -1, KEYS.p1Shot, KEYS.p2Shot);
    this.shot2 = new Shot(SHOT_WIDTH, SHOT_HEIGHT, 1, KEYS.p1Shot, KEYS.p2Shot);

    this.winner1 = new Winner(this.width / 2 + 85, (this.height + 35) / 2, WINNER_FONT);
    this.winner2 = new Winner((this.width / 2) - (85 * 2), (this.height + 35) / 2, WINNER_FONT);

    document.addEventListener("keydown", (event) => {
      if (event.key === KEYS.pause) {
        this.paddle1.setSpeed(PADDLE_SPEED);
        this.paddle2.setSpeed(PADDLE_SPEED);
        this.paused = !this.paused;
      } else if (event.key === KEYS.restart) {
        this.paused = false;
        this.paddle1.setSpeed(PADDLE_SPEED);
        this.paddle2.setSpeed(PADDLE_SPEED);
        this.paddle1.reset();
        this.paddle2.reset();
        this.ball1.reset();
        this.ball2.reset();
      } else if (event.key === KEYS.p1Shot) {
        this.shot1.reset(this.paddle1, this.paddle2);
      } else if (event.key === KEYS.p2Shot) {
        this.shot2.reset(this.paddle1, this.paddle2);
      }
    });
  }

  render() {
    if (this.paused) {
      this.paddle1.setSpeed(0);
      this.paddle2.setSpeed(0);
      return;
    }

    if (this.paddle1.getScore() >= 5 || this.paddle2.getScore() >= 5) {
      this.paused = !this.paused;
    }

    this.gameElement.innerHTML = '';

    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);
    svg.setAttributeNS(null, "viewBox", `0 0 ${this.width} ${this.height}`);
    this.gameElement.appendChild(svg);

    this.board.render(svg);
    this.paddle1.render(svg);
    this.paddle2.render(svg);

    /* make first ball */
    this.ball1.render(svg, this.paddle1, this.paddle2);

    /* make second ball after get 2 points*/
    if (this.paddle1.getScore() >= 2 || this.paddle2.getScore() >= 2) {
      this.ball2.render(svg, this.paddle1, this.paddle2);
    }

    this.score1.render(svg, this.paddle1.getScore());
    this.score2.render(svg, this.paddle2.getScore());
    this.winner1.render(svg, this.paddle1.getScore());
    this.winner2.render(svg, this.paddle2.getScore());
    this.shot1.render(svg, this.paddle1, this.paddle2, this.paddle1.getScore());
    this.shot2.render(svg, this.paddle1, this.paddle2, this.paddle2.getScore());
  }
}
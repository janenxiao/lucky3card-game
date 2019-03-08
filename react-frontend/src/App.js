import React, { Component } from 'react';
//import './App.css';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

const myHands = [
  ["2c", "10c", "14s", "user", "lose"],
  ["2d", "14h", "2s", "oppo"]
]

class App extends Component {
  constructor(props) {
    super(props);

    const userWins = myHands[0].pop() === "win" ? true : false;
    let hands = myHands.map(hand => this.fillPlayerData(hand));
    this.state = {
      user: hands[0],
      oppo: hands[1],
      userWins: userWins
    };
  }

  fillPlayerData(cardstrs) {
    const isUser = cardstrs.pop() === "user" ? true : false;
    let cards = cardstrs.map((cardstr, index) => ({ index: index, revealed: false, cardstr: cardstr }));
    let playerData = {
      coins: 10,
      coinsUpdate: "",
      isUser: isUser,
      cards: cards
    };
    return playerData;
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <Sidebar />
          <div className="col col-lg-8">
            <Player playerData={this.state.oppo} />
            <div style={{ marginTop: '20vh' }}>
              <Player playerData={this.state.user} onReveal={this.handleReveal} onPlay={this.handlePlay} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleReveal = card => {
    const newUser = { ...this.state.user };
    newUser.cards = [...newUser.cards];
    newUser.cards[card.index] = { ...card };
    newUser.cards[card.index].revealed = true;
    this.setState({
      user: newUser
    });
  }

  handlePlay = (isPlay, ante, wager) => {
    const newUser = { ...this.state.user };
    let result, coinsChange;

    if (isPlay) {
      if (this.state.userWins) {
        coinsChange = ante + wager;
        result = "playwin";
      }
      else {
        coinsChange = -1 * (ante + wager);
        result = "playlose";
      }
    }
    else { // user folded
      coinsChange = -1 * ante;
      result = this.state.userWins ? "foldwin" : "foldlose";
    }
    newUser.coins += coinsChange;
    newUser.coinsUpdate = ((coinsChange > 0) ? "+" : "") + coinsChange.toString();

    // Reveal opponent's cards and update opponent's coins
    const newOppo = { ...this.state.oppo };
    // deep clone the array of cards by cloning each card
    newOppo.cards = newOppo.cards.map(card => ({ ...card, ...{ revealed: true } }));
    coinsChange = -1 * coinsChange;
    newOppo.coins += coinsChange;
    newOppo.coinsUpdate = ((coinsChange > 0) ? "+" : "") + coinsChange.toString();

    this.setState({
      user: newUser,
      oppo: newOppo
    });

    return result;
  }

}

export default App;

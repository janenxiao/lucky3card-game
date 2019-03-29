import React, { Component } from 'react';
//import './App.css';
import Sidebar from './components/Sidebar';
import Player from './components/Player';


class App extends Component {
  constructor(props) {
    super(props);

    if ("handList" in window)
      this.fillInitialPlayerData(window.handList);
    else { // since fetch() returns a Promise, we first initiate state to random data then update with fetched data
      let handList = [["6c", "4d", "10h", "High card", "lose"], ["12c", "7h", "10s", "High card"]];
      this.fillInitialPlayerData(handList);

      this.handleNewRound(false);
    }
  }

  fillPlayerData(cardstrs, coins = 10) {
    const typeOfHand = cardstrs.pop();
    let cards = cardstrs.map((cardstr, index) => ({ index: index, revealed: false, cardstr: cardstr }));
    let playerData = {
      coins: coins,
      coinsUpdate: "",
      typeOfHand: typeOfHand,
      cards: cards
    };
    return playerData;
  }

  fillInitialPlayerData = handList => {
    const userResult = handList[0].pop();
    let hands = handList.map(hand => this.fillPlayerData(hand));
    hands[0].isUser = true;
    hands[1].isUser = false;
    this.state = {
      user: hands[0],
      oppo: hands[1],
      userResult: userResult
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-end">
          <Sidebar />
          <div className="col col-lg-9">
            <Player playerData={this.state.oppo} />
            <div style={{ marginTop: '20vh' }}>
              <Player playerData={this.state.user} onReveal={this.handleReveal} onPlay={this.handlePlay} onNewRound={this.handleNewRound} />
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
    let roundResult, results, coinsChange;

    if (isPlay) {
      if (this.state.userResult === "win") {
        coinsChange = ante + wager;
        roundResult = "playwin";
      }
      else if (this.state.userResult === "lose") {
        coinsChange = -1 * (ante + wager);
        roundResult = "playlose";
      }
      else { // tie
        coinsChange = 0;
        roundResult = "tie";
      }
    }
    else { // user folded
      coinsChange = -1 * ante;
      roundResult = (this.state.userResult === "lose") ? "foldlose" : "foldwin";
    }
    newUser.coins += coinsChange;
    newUser.coinsUpdate = ((coinsChange >= 0) ? "+" : "") + coinsChange.toString();

    // Reveal opponent's cards and update opponent's coins
    const newOppo = { ...this.state.oppo };
    // deep clone the array of cards by cloning each card
    newOppo.cards = newOppo.cards.map(card => ({ ...card, ...{ revealed: true } }));
    coinsChange = -1 * coinsChange;
    newOppo.coins += coinsChange;
    newOppo.coinsUpdate = ((coinsChange >= 0) ? "+" : "") + coinsChange.toString();

    if (newUser.coins <= 0)
      results = [roundResult, "Good game"];
    else if (newOppo.coins <= 0)
      results = [roundResult, "You win!"];
    else
      results = [roundResult];

    this.setState({
      user: newUser,
      oppo: newOppo
    });

    return results;
  }

  fillNewRoundPlayerData = (handList, isNewGame = false) => {
    const userResult = handList[0].pop();
    let user, oppo;
    if (isNewGame) { // if starting a new game, reset coins to initial state
      user = this.fillPlayerData(handList[0]);
      oppo = this.fillPlayerData(handList[1]);
    }
    else {
      user = this.fillPlayerData(handList[0], this.state.user.coins);
      oppo = this.fillPlayerData(handList[1], this.state.oppo.coins);
    }
    user.isUser = true;
    oppo.isUser = false;
    this.setState({
      user,
      oppo,
      userResult
    });
  }

  handleNewRound = isNewGame => {
    const fetchURL = '/get_handList';
    fetch(fetchURL)
      // the callback function's this keyword is bound to handleNewRound()'s this keyword, which was inherited from the App class
      .then(function (response) {
        if (response.status !== 200) {
          console.log('Fetch Error: Status Code: ' + response.status);
          alert('Fetch Error: Status Code: ' + response.status);
          return;
        }
        // if request success 
        response.json().then(data => this.fillNewRoundPlayerData(data, isNewGame));
      }.bind(this))
      .catch(function (err) {
        console.log('Fetch Error: ', err);
        alert('Fetch Error: ', err);
      });
  }

}

export default App;

import React, { Component } from 'react';
import './Player.css';
import iconCoins from '../imgs/iconCoins.svg';

// require every file in the cards folder
// const cardimgs = require.context('../../public/cards', false);
// <img src={cardimgs("./4c.svg")} />

class Player extends Component {
  state = {
    revealedCount: 0,
    ante: 1,
    anteEnabled: true,
    wager: 1,
    playEnabled: false,
    roundResult: "",
    gameResult: ""
  };

  render() {
    return (
      <div className="row" >
        <div className="col-8">
          <div style={{ maxWidth: 353 }}>
            <h5 style={{ fontFamily: 'cursive' }}>{this.getPlayerType()}</h5>
            <div id={this.getCardContainerId()}>
              {this.props.playerData.cards.map(card => (
                <img src={process.env.PUBLIC_URL + this.getCardImg(card)} style={this.getCardStyle(card.index)} className="img-fluid" onClick={() => this.imgReveal(card)} alt={`card${card.index}`} key={`card${card.index}`} />
              ))}
              {this.state.roundResult !== "" && // only user will have roundResult and gameResult changed from empty
                <img src={`${process.env.PUBLIC_URL}/img/${this.state.roundResult}.gif`} className="img-fluid" id="roundResult-gif" alt={this.state.roundResult} />
              }
              {this.state.gameResult !== "" &&
                <div id="gameResult" className={(this.state.gameResult === "You win!") ? "darksalmonred" : "greyshadow"}>{this.state.gameResult}</div>
              }
            </div>
          </div>
        </div>
        <div className="col-4 align-self-center">
          <div className="row">
            <div className="col">
              <img src={iconCoins} className="img-fluid" alt="Coins" />
              <span style={{ position: 'relative' }}>
                <span className="m-2 font-weight-bold">{this.props.playerData.coins}</span>
                {this.props.playerData.coinsUpdate !== "" && <span id="coins-update" className="m-2 font-weight-bold">{this.props.playerData.coinsUpdate}</span>}
              </span>
            </div>
            {this.props.playerData.isUser &&
              <div className="col" style={{ minWidth: 120 }}>
                <div>
                  <span className="font-weight-light w-33">ante</span><span className="w-33 text-center">{this.state.ante}</span>
                  {this.state.anteEnabled && <button className="btn btn-warning btn-sm" onClick={this.incrementAnte}>+</button>}
                </div>
                <div>
                  <span className="font-weight-light w-33">wager</span><span className="w-33 text-center">{this.state.wager}</span>
                  {this.state.playEnabled && <button className="btn btn-warning btn-sm" onClick={this.incrementWager}>+</button>}
                </div>
              </div>
            }
          </div>
          {this.props.playerData.coinsUpdate !== "" && <span className="m-2 font-weight-light">{this.props.playerData.typeOfHand}</span>}
          {(() => {
            if (this.props.playerData.isUser) {
              if (this.state.playEnabled) {
                return (
                  <div>
                    <button className="btn btn-success m-2" onClick={() => this.handlePlay(true)}>Play</button>
                    <button className="btn btn-secondary m-2" onClick={() => this.handlePlay(false)}>Fold</button>
                  </div>);
              }
              else if (this.state.gameResult !== "") { // this game has ended
                return (<button className="btn btn-success m-2" onClick={this.handleNewRound}>New Game</button>);
              }
              else if (this.props.playerData.coinsUpdate !== "") {
                return (<button className="btn btn-success m-2" onClick={this.handleNewRound}>Continue</button>);
              }
            }
          })()}
        </div>
      </div>
    );
  }

  getCardImg(card) {
    return card.revealed ? `/cards/${card.cardstr}.svg` : "/cards/cardback.svg"
  }

  imgReveal(card) {
    if (this.props.playerData.isUser && !card.revealed) {
      const { revealedCount } = this.state;
      // when revealing the third card, disable incrementAnte button, show incrementWager button and play and fold button
      if (revealedCount === 2) {
        this.setState({ anteEnabled: false, playEnabled: true });
      }
      this.setState({ revealedCount: revealedCount + 1 });
      this.props.onReveal(card);
    }
  }

  getCardStyle(index) {
    const left = `${index * 16}%`;
    let cardStyle = {
      left: left
    }
    // position 'absolute' makes element disregard grid rules, like it flows on top of other elements
    // thus need one card hold the position, other card can flow (stack) on top of it
    if (index !== 0)
      cardStyle.position = 'absolute';
    return cardStyle
  }

  getCardContainerId() {
    return "cardcontainer-" + (this.props.playerData.isUser ? "user" : "oppo");
  }

  getPlayerType() {
    return this.props.playerData.isUser ? "You" : "Opponent";
  }

  incrementAnte = () => {
    const { ante, wager } = this.state;
    if (ante + wager >= this.props.playerData.coins)
      alert("Hey that's all the money you've got to ante!");
    else
      this.setState({ ante: this.state.ante + 1 });
  }

  incrementWager = () => {
    const { ante, wager } = this.state;
    if (ante + wager >= this.props.playerData.coins)
      alert("Hey that's all the money you've got to bet!");
    else if (wager >= ante)
      alert("Hey wager can't be more than ante");
    else
      this.setState({ wager: this.state.wager + 1 });
  }

  handlePlay = isPlay => {
    if (this.props.playerData.isUser) {
      const { ante, wager } = this.state;
      const results = this.props.onPlay(isPlay, ante, wager);

      const roundResult = results[0];
      if (results.length > 1)
        this.setState({ gameResult: results[1] });

      this.setState({
        ante: 0,
        wager: 0,
        playEnabled: false,
        roundResult
      });
    }
  }

  handleNewRound = () => {
    if (this.props.playerData.isUser) {
      const isNewGame = this.state.gameResult !== "";
      this.props.onNewRound(isNewGame);

      // when player only has 1 coin, it will be used as ante, so wager should be 0
      const wager = (!isNewGame && this.props.playerData.coins < 2) ? 0 : 1;
      // set to initial state
      this.setState({
        revealedCount: 0,
        ante: 1,
        anteEnabled: true,
        wager: wager,
        roundResult: "",
        gameResult: ""
      });
    }
  }
}

export default Player;
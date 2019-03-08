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
    result: "unknown"
  };

  render() {
    return (
      <div className="row" >
        <div className="col-8">
          <div style={{ maxWidth: 353 }}>
            <div id={this.getCardContainerId()}>
              {this.props.playerData.cards.map(card => (
                <img src={process.env.PUBLIC_URL + this.getCardImg(card)} style={this.getCardStyle(card.index)} className="img-fluid" onClick={() => this.imgReveal(card)} alt={`card${card.index}`} key={`card${card.index}`} />
              ))}
              {this.state.result !== "unknown" && // only user will have this property changed from "unknown"
                <img src={`${process.env.PUBLIC_URL}/img/${this.state.result}.gif`} className="img-fluid" id="resultgif" alt={this.state.result} />
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
                  <span className="font-weight-light w-33">ante</span><span className="w-33">{this.state.ante}</span>
                  {this.state.anteEnabled && <button className="btn btn-warning btn-sm" onClick={this.incrementAnte}>+</button>}
                </div>
                <div>
                  <span className="font-weight-light w-33">bet</span><span className="w-33">{this.state.wager}</span>
                  {this.state.playEnabled && <button className="btn btn-warning btn-sm" onClick={this.incrementWager}>+</button>}
                </div>
              </div>
            }
          </div>
          {this.props.playerData.isUser && this.state.playEnabled &&
            <div>
              <button className="btn btn-success m-2" onClick={() => this.handlePlay(true)}>Play</button>
              <button className="btn btn-secondary m-2" onClick={() => this.handlePlay(false)}>Fold</button>
            </div>
          }
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
      if (revealedCount == 2) {
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

  incrementAnte = () => {
    const { ante } = this.state;
    if (ante === this.props.playerData.coins)
      alert("Hey that's all the money you've got to ante!");
    else
      this.setState({ ante: this.state.ante + 1 });
  }

  incrementWager = () => {
    const { ante, wager } = this.state;
    if (ante + wager === this.props.playerData.coins)
      alert("Hey that's all the money you've got to bet!");
    else
      this.setState({ wager: this.state.wager + 1 });
  }

  handlePlay = isPlay => {
    if (this.props.playerData.isUser) {
      const { ante, wager } = this.state;
      const result = this.props.onPlay(isPlay, ante, wager);

      this.setState({
        ante: 0,
        wager: 0,
        playEnabled: false,
        result
      });
    }
  }

  injectHTML() {
    return (<div>
      <p>hello</p>
      <span className="font-weight-light w-33">thank</span><span>you</span>
    </div>);
  }
}

export default Player;
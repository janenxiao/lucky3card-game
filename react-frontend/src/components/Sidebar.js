import React, { Component } from 'react';
import './Sidebar.css';

class Sidebar extends Component {
  state = {
    visible: true
  };

  render() {
    return (
      <div className={"col-lg-3 d-none d-lg-block bg-light" + (this.state.visible ? "" : " invisible")} id="sidebar-wrapper">
        <div className="sidebar-sticky">
          <button className="btn btn-link btn-sm visible" type="button" onClick={this.toggleVisibility}>{this.state.visible ? "Hide" : "Show Instructions"}</button>
          <h6>Instructions</h6>
          <ol>
            <li>Learn the rules of <span className="font-italic">Three Card Poker</span></li>
            <li>Click on ANY of the 3 cards on the bottom to flip</li>
            <li>Place ante before flipping the last card</li>
            <li>Place wager and play, or fold. <span className="font-weight-light">Wager can't be greater than ante.</span></li>
            <li>If fold, ante will be deducted</li>
            <li>If play, ante and wager will be paid or lost based on result</li>
            <li>Opponent will gain or lose the same amount</li>
          </ol>

          <h6>Hand ranks</h6>
          <ol>
            <li title="Three cards of same suit in sequence">Straight flush</li>
            <li title="Three cards of same rank">Three of a kind</li>
            <li title="Three cards in sequence">Straight</li>
            <li title="Three cards of same suit">Flush</li>
            <li title="Two cards of same rank">Pair</li>
            <li>High card</li>
          </ol>
        </div>
      </div>
    );
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  }
}

export default Sidebar;
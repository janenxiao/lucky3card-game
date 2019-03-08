import React, { Component } from 'react';
import './Sidebar.css';

class Sidebar extends Component {

  render() {
    return (
      <div class="col-lg-2 d-none d-lg-block bg-light" id="sidebar-wrapper">
        <div class="sidebar-sticky">
          <h6>Instructions</h6>
          <ol>
            <li>Place ante before flipping any cards</li>
            <li>Click on any card to flip</li>
            <li>Increase wager before flipping the last card</li>
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
}

export default Sidebar;
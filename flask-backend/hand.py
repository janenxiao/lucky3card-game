"""This module contains three classes: Card, Hand, PairHand.

Card has 2 attributes: rank and suit.
Hand stores player id, type of this hand, and a list of Card.
PairHand is a subclass of Hand which overrides method compare_rank_of_hands() in Hand
"""

import random
from enum import Enum


class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def __repr__(self):
        return f"{self.__class__.__name__}({self.rank}{self.suit})"

    def __str__(self):
        return f"{self.rank}{self.suit}"

    # def __eq__(self, other):
    #     if isinstance(other, Card):
    #         return self.rank == other.rank and self.suit == other.suit
    #     return NotImplemented
    # def __hash__(self):
    #     return hash((self.rank, self.suit))

    @classmethod
    def generate_card(cls):
        """Return a Card with random rank and suit"""
        rank = random.randint(2, 14)
        suitIndex = random.randint(0, 3)
        # print(f"suit {suitIndex}")
        suit = "shcd"[suitIndex]
        return cls(rank, suit)


class Hand:
    class TypeOfHand(Enum):
        straightFlush = 6
        threeOfAKind = 5
        straight = 4
        flush = 3
        pair = 2
        highCard = 1

        def __lt__(self, other):
            if self.__class__ is other.__class__:
                return self.value < other.value
            return NotImplemented

        def __int__(self):
            return self.value

        def __str__(self):
            return ["", "High card", "Pair", "Flush", "Straight", "Three of a kind", "Straight flush"][self.value]

    def __init__(self, id, type, cardList, highRank):
        self.id = id
        self.type = type
        self.cardList = cardList
        self.highRank = highRank  # cache the highest rank in the list of cards

    def __repr__(self):
        return f"{self.__class__.__name__}(id-{self.id} {self.type}: {self.cardList})"

    def __str__(self):
        return str([str(card) for card in self.cardList])

    def get_cardstrList(self):
        return [str(card) for card in self.cardList]

    def get_typeOfHand(self):
        return str(self.type)

    @classmethod
    def generate_hands(cls, num):
        """Return num hands in a list with no duplicate cards"""
        handList = []
        cardList = []
        cardSet = set()
        # create Cards
        for i in range(num*3):
            card = Card.generate_card()
            while str(card) in cardSet:
                card = Card.generate_card()
            cardList.append(card)
            cardSet.add(str(card))

        random.shuffle(cardList)
        # create Hands
        for i in range(num):
            cL = cardList[i*3:(i+1)*3]
            handList.append(cls.create_hand(cL, i))
        return handList

    @classmethod
    def create_hand(cls, cardList, id):
        """Return a Hand or PairHand from a list of 3 Cards and an id"""
        # Determine the type of this hand
        suitList = [hand.suit for hand in cardList]
        rankList = [hand.rank for hand in cardList]

        handStraight, highRank = Hand.determine_straight(rankList)
        handFlush, dupSuit = Hand.determine_triplet_or_pair(suitList)
        handThreeOfAKind, dupRank = Hand.determine_triplet_or_pair(rankList)

        # if Ace is used as 1 in Straight, change card rank from 14 to 1
        if handStraight and sorted(rankList) == [2, 3, 14]:
            for card in cardList:
                if card.rank == 14:
                    card.rank = 1
                    break

        if handStraight and handFlush:
            type = cls.TypeOfHand.straightFlush
        elif handThreeOfAKind:
            type = cls.TypeOfHand.threeOfAKind
        elif handStraight:
            type = cls.TypeOfHand.straight
        elif handFlush:
            type = cls.TypeOfHand.flush
        elif dupRank is not None:
            type = cls.TypeOfHand.pair
            return PairHand(id, type, cardList, highRank, dupRank)
        else:
            type = cls.TypeOfHand.highCard

        return cls(id, type, cardList, highRank)

    @staticmethod
    def determine_straight(intList):
        """Return if the 3 integers in list are consecutive, and the largest integer in list"""
        minInt = min(intList)
        sortedList = sorted(intList)
        if sortedList == list(range(minInt, minInt + 3)):
            return True, minInt + 2
        return sortedList == [2, 3, 14], sortedList[-1]

    @staticmethod
    def determine_triplet_or_pair(myList):
        """Return if the 3 items in list are identical, and the duplicate in list"""
        first = myList[0]
        countFirst = myList.count(first)
        if countFirst == 3:
            return True, first
        if countFirst == 2:
            return False, first
        if myList[1] == myList[2]:
            return False, myList[1]
        return False, None

    @staticmethod
    def compare_rank_of_hands(handList):
        """Return largest hand(s) in list. Hands in handList should all be the same type"""
        highestRank = 1
        highRankHandList = []

        # Compare the highest rank in each hand
        for hand in handList:
            if hand.highRank > highestRank:
                highestRank = hand.highRank
                highRankHandList.clear()
                highRankHandList.append(hand)
            elif hand.highRank == highestRank:
                highRankHandList.append(hand)

        handList = highRankHandList

        # Compare the second and third highest rank in each hand
        for i in range(1, -1, -1):
            if len(handList) < 2:
                break
            highestRank = 1
            highRankHandList = []

            for hand in handList:
                rankList = [hand.rank for hand in hand.cardList]
                rankList.sort()
                comparingRank = rankList[i]
                if comparingRank > highestRank:
                    highestRank = comparingRank
                    highRankHandList.clear()
                    highRankHandList.append(hand)
                elif comparingRank == highestRank:
                    highRankHandList.append(hand)

            handList = highRankHandList

        return handList


class PairHand(Hand):
    def __init__(self, id, type, cardList, highRank, dupRank):
        super().__init__(id, type, cardList, highRank)
        self.dupRank = dupRank

    @staticmethod
    def compare_rank_of_hands(handList):
        """Return largest hand(s) in list. Hands in handList should all be PairHand"""
        highestRank = 1
        highRankHandList = []

        for hand in handList:
            if hand.dupRank > highestRank:
                highestRank = hand.dupRank
                highRankHandList.clear()
                highRankHandList.append(hand)
            elif hand.dupRank == highestRank:
                highRankHandList.append(hand)

        if len(highRankHandList) < 2:
            return highRankHandList

        highestRank = 1
        handList = []

        for hand in highRankHandList:
            rankList = [hand.rank for hand in hand.cardList]
            remainingRank = [x for x in rankList if x != hand.dupRank][0]
            if remainingRank > highestRank:
                highestRank = remainingRank
                handList.clear()
                handList.append(hand)
            elif remainingRank == highestRank:
                handList.append(hand)

        return handList


# print(Hand.generate_hands(3))

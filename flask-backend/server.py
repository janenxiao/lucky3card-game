import os
from hand import Hand
from flask import Flask, render_template, jsonify
app = Flask(__name__)


def getHandList():
    handstrList = []
    handList = Hand.generate_hands(2)
    for i in range(2):
        hL = handList[i].get_cardstrList()
        hL.append(handList[i].get_typeOfHand())
        handstrList.append(hL)

    if handList[0].type > handList[1].type:
        userResult = "win"
    elif handList[0].type < handList[1].type:
        userResult = "lose"
    else:
        winnerHandList = handList[0].compare_rank_of_hands(handList)
        if len(winnerHandList) == 1:
            if winnerHandList[0] == handList[0]:
                userResult = "win"
            else:
                userResult = "lose"
        else:
            userResult = "tie"  # len(winnerHandList) == 2

    handstrList[0].append(userResult)
    return handstrList


@app.route('/get_handList')
def get_handList():
    return jsonify(getHandList())


@app.route("/")
def man_computer():
    return render_template('index.html', handList=getHandList())


if __name__ == "__main__":
    app.run(host='localhost', port=os.environ.get('PORT', 5000), debug=True)
    # app.run(debug=True)  # 127.0.0.1:5000

# print(getHandList())

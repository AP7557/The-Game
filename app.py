'''Server Side'''
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

db.create_all()
import models

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    '''Initial function for server-side socketio'''
    return send_from_directory('./build', filename)


def add_db(username):
    '''Add person in database'''
    new_user = models.Person(username=username, score=100)
    db.session.add(new_user)
    db.session.commit()
    return new_user


@socketio.on('printdb')
def print_db():
    '''Return everything in database in descending order'''
    all_people = models.Person.query.order_by(models.Person.score.desc()).all()
    users = []
    for person in all_people:
        users.append({'username': person.username, 'score': person.score})
    socketio.emit('user_list', {'users': users}, broadcast=True)
    return users


# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    '''When someone connects to the server'''
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    '''When someone disconnects to the server'''
    print('User disconnected!')


@socketio.on('click')
def on_click(data):
    '''If the board is changed, emit the change to all the connected users'''
    print(str(data))

    socketio.emit('click', data, broadcast=True)
    return data


@socketio.on('winner')
def on_winner(data):
    '''Edit the score of the players'''
    winner = data['winner']
    loser = data['loser']
    print(winner, loser)
    db.session.query(models.Person)\
        .filter(models.Person.username == winner)\
        .update({models.Person.score: models.Person.score+1})
    db.session.query(models.Person)\
    .filter(models.Person.username == loser)\
    .update({models.Person.score: models.Person.score-1})

    db.session.commit()
    print_db()
    return data


@socketio.on('reset')
def on_reset(data):
    '''Reset the board, and all the values'''
    print(str(data))

    socketio.emit('reset', data, broadcast=True)


dic = {"X": "", "O": "", "spec": []}


@socketio.on('username')
def on_username(data):
    '''Find out who is playing and who is the spectator when the join'''
    print("MOUNT", str(data))
    if dic["X"] == "" or dic['X'] == data['username']:
        dic["X"] = data['username']
    elif dic["O"] == "" or dic['O'] == data['username']:
        dic["O"] = data['username']
    else:
        dic['spec'].append(data['username'])

    socketio.emit('username', dic, broadcast=True)
    return dic


@socketio.on('join')
def on_join(data):
    '''Add the user to the database if not already in it'''
    print(str(data))
    user_in_db = models.Person.query.filter_by(
        username=data['username']).first()
    if user_in_db is None:
        add_db(data['username'])

    print_db()


@socketio.on('logout')
def on_logout(data):
    '''When a user logs out get the next spectator to play'''
    print("UNMOUNT", str(data))

    if data['currentUser'] != "":
        if dic["X"] == data['currentUser']:
            dic["X"] = ""
            if len(dic['spec']) != 0:
                next_user = dic['spec'].pop(0)
                dic["X"] = next_user
        elif dic["O"] == data['currentUser']:
            dic["O"] = ""
            if len(dic['spec']) != 0:
                next_user = dic['spec'].pop(0)
                dic["O"] = next_user
        elif data['currentUser'] in dic['spec']:
            dic['spec'].pop(dic['spec'].index(data['currentUser']))

    socketio.emit('username', dic, broadcast=True)
    return dic


# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )

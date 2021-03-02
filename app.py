import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    all_people = models.Person.query.all()
    users = []
    for person in all_people:
        users.append(person.username)
    print(users)
    socketio.emit('user_list', {'users': users})

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'click' to the server, this function is run
# 'click' is a custom event name that we just decided
@socketio.on('click')
def on_Click(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'click' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('click',  data, broadcast=True, include_self=False)

@socketio.on('reset')
def on_Reset(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'click' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('reset',  data, broadcast=True, include_self=False)

dic = {
    "X": "",
    "O": "",
    "spec": []
}
@socketio.on('username')
def on_UserName(data):
    print("MOUNT", str(data))
    if dic["X"] == "" or dic['X'] == data['username'] :
        dic["X"] = data['username']
    elif dic["O"] == "" or dic['O'] == data['username']:
        dic["O"] = data['username']
    else:
        dic['spec'].append(data['username'])
    print(dic)
    socketio.emit('username', dic, broadcast=True, include_self=False)

@socketio.on('logout')
def on_Logout(data):
    print("UNMOUNT", str(data))
    if(data['currentUser'] != ""):
        if dic["X"] == data['currentUser']:
            dic["X"] = ""
        elif dic["O"] == data['currentUser']:
            dic["O"] = ""
        else:
            dic['sepc'].pop(dic['sepc'].index(data['currentUser']))
            nextUser = dic['sepc'].pop(0)
            if dic["X"] == "":
                dic["X"] = nextUser
            elif dic["O"] == "":
                dic["O"] = nextUser
    print(dic)
    socketio.emit('logout',  dic, broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
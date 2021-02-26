import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

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

dic = {
    'players': [],
    'spec': []
}
@socketio.on('username')
def on_UserName(data):
    print("MOUNT", str(data))
    if(len(dic['players']) < 2):
        dic['players'].append(data['username'])
    else:
        dic['spec'].append(data['username'])
    print(dic)
    socketio.emit('username', dic, broadcast=True, include_self=False)

@socketio.on('logout')
def on_Logout(data):
    print("UNMOUNT", str(data))
    if(data in dic['players']):
       dic['players'].pop(dic['players'].index(data['user']))
       dic['players'].append(dic['spec'].pop(0))
    else:
        dic['spec'].pop(dic['spec'].index(data['user']))

    print(dic)
    socketio.emit('logout',  data, broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
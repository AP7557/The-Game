# The Game
The Game is an app that allows users to play a simple multiplayer Tic-Tac-Toe.

## Requirements and RUN
1. `npm install`
2. `pip install -r requirements.txt`
3. `npm install socket.io-client --save`
4. `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local`
5. `Run command in terminal (in your project directory): python app.py`
6. `Run command in another terminal (in your project directory): npm run start`

- [x] First and second users can play Tic Tac Toe online and see live updates of each others’ moves.
- [x] Spectators (third user and after) are not able to play moves.
- [x] To view the game, user must first “log in” with username
- [x] Restart button and user list displayed and updated
- Emmit and handle
-       [x] Turn played
-       [x] User joining
-       [x] Restarting game

## Question and Answer
1. What are 2+ technical issues encountered with the project? How did you fix them?
- One of the problems I encountered was when deploying to heroku, it was not getting rendred and kept giving me error of flask not found, I had to edit my requirements.txt and find a way to unlink my current heroku and redo the steps to deploy
- Some times, I had to exit out of my AWS and relogin, either because it forced me to and/or it just wouldn't load the code and take forever
- When I made changes to my code, sometimes it wouldn't update the app the way I wanted to, or sometimes it would update it and work fine, but then I rerun my server to make sure, and it would just break or not work that way it should, like when I was doing the winner part, it worked sometimes and without changing the code it would just stop working, I had to quit the server, redo my entire winner and log all the variables I changed to see if it updates.

2. What are 2+ known problems, if any, with the project?
- As of right not if a user closes the tab and leaves, it will not update the list of users, I would either have to make a logout button with is not a good idea, or I would have to log the variables and see if the functions are getting called
- I want to add a chat feature, where everyone in the session can talk to each other, I would have to send and receive list of messages to the server and back to all the client that are connected to the session to map over them
- I also want to add a different session where 2+ users can join another session from the public game and play instead of just looking at the current game, I would implement it by having a button that asks for a room number, and then would redirect the user to the room session where he/she can do the same thing as in public session

## Framework used
- [Flask](https://flask.palletsprojects.com/en/1.1.x/quickstart/) - Different endpoint for web application
- [React](https://reactjs.org) - Front-end Component-based, single page

## Libraries used
- [os](https://docs.python.org/3/library/os.html) - Operating system dependent functionality
- [flask_socketio](https://flask-socketio.readthedocs.io/en/latest/) - Communication between client<->server
- [flask_cors](https://flask-cors.readthedocs.io/en/latest/) - Handling Cross Origin Resource Sharing

## Technology used
- [AWS-Cloud9](https://aws.amazon.com/cloud9/) - Online IDE for write, run, and debug serverless applications
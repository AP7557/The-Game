# The Game
The Game is an app that allows users to play a simple multiplayer Tic-Tac-Toe.

## Requirements and RUN
1. `npm install`
2. `pip install -r requirements.txt`
3. `npm install socket.io-client --save`
4. `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local`
5. `Login and fill creds: heroku login -i`
6. `Create a new Heroku app: heroku create`
7. `Create a new remote DB on your Heroku app: heroku addons:create heroku-postgresql:hobby-dev`
8. `See the config vars set by Heroku for you: heroku config`
9. `Copy paste the value for DATABASE_URL`
10. `Run touch .env && echo "DATABASE_URL='copy-paste-database-url-here'" >> .env'
11. `Run command in terminal (in your project directory): python app.py`
12. `Run command in another terminal (in your project directory): npm run start`

- [x] Clicking on "Leaderboard" button shows/hides component on same page
- [x] Leaderboard automatically  updates when a new player (username not stored in DB) logs in
- [x] Leaderboard automatically updates if game has a winner/loser
- [x] User's name highlighted on leaderboard
- [x] Leaderboard shows username and ranking from highest to lowest

## Question and Answer
1. What are 2+ technical issues encountered with the project? How did you fix them?
- One of the problems I encountered was sometimes my leaderboard would not showup, it will show up the first render, but if I listen for changes from the server, it would never get rendered, I fixed it by, calling the server to give me the data, for every rander component, instead of just listening for the changes, it wont listen when the component was unmonted. 
- Another problem I had was when someone won or lose, it would update in the database 5-10 times in a row, so instead of sending the winner data back to the server for every user, I just had to send to from a single user.

2. What are 2+ known problems, if any, with the project, if not and ideas?
- I want the current users username at the top of the board and everyone else at the bottom, I can do that by storing the current user in a usestate, and rendering that first and then all the other users.
- I still want to add a chat feature, where everyone in the session can talk to each other, I would have to send and receive list of messages to the server and back to all the client that are connected to the session to map over them
- I want to add a search functionally for the leaderboard, by haveing an input field, and everything someone types in a users, it access the databases and filters based on the username, and just sends back the list of usernames that match that user. 

## Framework used
- [Flask](https://flask.palletsprojects.com/en/1.1.x/quickstart/) - Different endpoint for web application
- [React](https://reactjs.org) - Front-end Component-based, single page

## Libraries used
- [os](https://docs.python.org/3/library/os.html) - Operating system dependent functionality
- [flask_socketio](https://flask-socketio.readthedocs.io/en/latest/) - Communication between client<->server
- [flask_cors](https://flask-cors.readthedocs.io/en/latest/) - Handling Cross Origin Resource Sharing
- [flask_sqlalchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) - Using SQL commands in Flask

## Technology used
- [AWS-Cloud9](https://aws.amazon.com/cloud9/) - Online IDE for write, run, and debug serverless applications

# GameDB

Overview

Gamer DB is a web application that allows users to explore, search, and manage their game collections digitally. This platform uses APIs to provide game information and metadata. Users can maintain a personalized library of games. Users can search and view a database of games, and also see current deals on games if they're interested in purchasing.

This project integrates RAWG, CheapShark, and GiantBomb APIs. All deals are redirected through CheapShark's links.

Prerequisites
Node.js and npm
MongoDB

Use "npm install" to install dependencies before launching.

API keys are required and will be provided in the env file.

Use "node app.js" to start the server. The app is set to run on Port 3000.

Known Issues:
Login functionality - User authentication is partly implemented but still requires debugging. Users may encounter issues when logging in.

Inconsistent box art - While the original intent of implementing GiantBomb's API was to provide box art for games, there are inconsistencies in the way this API communicates with the RAWG API which may cause a mismatch between image displayed and game viewed. This is primarily an issue in the search and details pages, and requires further enhancement.

Future Enhancements:
Complete login and profile management features
Further UX and design improvements
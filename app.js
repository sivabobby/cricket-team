const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = null;

const dbPath = path.join(__dirname, "cricketTeam.db");

const integrationAndServerStart = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Hay Bobby Server is Started http://localhost:3000");
    });
  } catch (error) {
    console.log(`Hay this is an error: ${error.message}`);
    process.exit(1);
  }
};

integrationAndServerStart();

//Get ALL Details
app.get("/players/", async (request, response) => {
  const myQuery = `select * from cricket_team order by player_id`;
  const responseData = await db.all(myQuery);
  response.send(responseData);
  console.log("Returns a list of all players in the team all Data");
});

//Insert New Details into table
app.post("/players/", async (request, response) => {
  const postDetails = request.body;
  const { playerName, jerseyNumber, role } = postDetails;
  const myQuery = `insert cricket_team into (player_name, jersey_number, role) values 
  ('${playerName}', ${jerseyNumber},'${role}');`;
  const responseBody = await db.run(myQuery);
  const playerId = responseBody.lastID;
  response.send({ playerId: playerId });
  console.log("Player Added to Team");
});

//Get Player by PlayerId
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const myQuery = `select * from cricket_team where player_id = ${playerId};`;
  const responseBody = await db.get(myQuery);
  response.send(responseBody);
  console.log("Returns a player based on a player ID");
});

//Update Details in it
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const teamDetails = request.body;
  const { playerName, jerseyNumber, role } = teamDetails;

  const myQuery = `update cricket_team set 
  player_name = '${playerName}', 
  jerseyNumber = ${jerseyNumber}, 
  role = '${role}' 
  where jersey_number = ${playerId};`;

  const responseBody = await db.run(myQuery);
  response.send(responseBody);
  console.log("Player Details Updated");
});

//Delete Details
app.delete("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const myQuery = `delete from cricket_team where player_id = ${playerId};`;
  const responseBody = await db.delete(myQuery);
  response.send(responseBody);
  console.log("Player Removed");
});

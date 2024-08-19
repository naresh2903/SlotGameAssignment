## Author

Developed by Narendra Pal.

# Assignment

This repository contains a server implementation for a slot game built using TypeScript and a RESTful framework. The game involves a 5x3 grid with symbols and a wild multiplier, and it supports cascading effects up to 5 times.

### Installation

1. **Unzip the File**

   - Extract the contents of the project file to a directory on your local machine.

2. **Install Dependencies**

   - Navigate to the project directory in your terminal and run:
     ```bash
     npm install
     ```
     This command will install all the necessary dependencies required for the project.

3. **Build the Project**

   - Compile the TypeScript code by running:
     ```bash
     npm run build
     ```

4. **Start the Server**
   - Start the server with:
     ```bash
     npm start
     ```
     The server will start and listen on port 3000 by default.

### Run test cases

```bash
npm run test
```

### Testing the API

To test the API, you can use Postman or any other API testing tool.

1. **Open Postman** (or your preferred tool).

2. **Send a POST Request**

   - Set the request method to POST.
   - Use the following URL:
     ```
     http://localhost:3000/game/spin
     ```
   - Send the request to see the response from the API.
   - ```
     {"bet":1}
     ```

   Add this in body tag

## Features

- **Grid Configuration**: A 5x3 grid with symbols and a wild symbol.
- **Wild Multiplier**: Randomly selected multiplier for the wild symbol.
- **Cascading Effect**: Re-generates the board and calculates the win for up to 5 cascades.
- **Winning Calculation**: Calculates ways win based on a paytable.

## API Endpoint

### POST /game/spin

- **Description**: Initiates a spin in the slot game and returns the result including symbol grid, win details, and cascade information.
- **Request Body**:
  ```json
  {
  	"bet": 1,
  	"force": [] // place for forcing random numbers or rngs
  }
  ```
- **Response**:
  ```json
  {
  	"request": {
  		"bet": 1
  	},
  	"response": [
  		{
  			"symbolGrid": [
  				[1, 6, 9],
  				[2, 6, 9],
  				[4, 0, 8],
  				[1, 7, 8],
  				[1, 2, 3]
  			],
  			"totalWin": 14,
  			"winDetails": [
  				{
  					"wildMultiplier": 6,
  					"win": 14,
  					"accumulatedWin": 14,
  					"cascadeIndex": 1,
  					"waysWins": [
  						{
  							"symbol": 6,
  							"offsets": [5, 6, 7],
  							"hasWildInWin": true,
  							"totalWin": 10,
  							"ways": 1,
  							"symbolCount": 3
  						},
  						{
  							"symbol": 9,
  							"offsets": [7, 10, 11],
  							"hasWildInWin": true,
  							"totalWin": 4,
  							"ways": 1,
  							"symbolCount": 3
  						}
  					]
  				}
  			]
  		},
  		{
  			"symbolGrid": [
  				[6, 8, 1],
  				[3, 8, 2],
  				[6, 4, 8],
  				[1, 7, 8],
  				[1, 2, 3]
  			],
  			"totalWin": 26,
  			"winDetails": [
  				{
  					"wildMultiplier": 1,
  					"win": 12,
  					"accumulatedWin": 26,
  					"cascadeIndex": 2,
  					"waysWins": [
  						{
  							"symbol": 8,
  							"offsets": [5, 6, 12, 13],
  							"hasWildInWin": false,
  							"totalWin": 12,
  							"ways": 1,
  							"symbolCount": 4
  						}
  					]
  				}
  			]
  		},
  		{
  			"symbolGrid": [
  				[5, 6, 1],
  				[6, 3, 2],
  				[9, 6, 4],
  				[3, 1, 7],
  				[1, 2, 3]
  			],
  			"totalWin": 36,
  			"winDetails": [
  				{
  					"wildMultiplier": 1,
  					"win": 10,
  					"accumulatedWin": 36,
  					"cascadeIndex": 3,
  					"waysWins": [
  						{
  							"symbol": 6,
  							"offsets": [1, 5, 7],
  							"hasWildInWin": false,
  							"totalWin": 10,
  							"ways": 1,
  							"symbolCount": 3
  						}
  					]
  				}
  			]
  		},
  		{
  			"symbolGrid": [
  				[7, 5, 1],
  				[8, 3, 2],
  				[3, 9, 4],
  				[3, 1, 7],
  				[1, 2, 3]
  			],
  			"totalWin": 36,
  			"winDetails": [
  				{
  					"wildMultiplier": 1,
  					"win": 0,
  					"accumulatedWin": 36,
  					"cascadeIndex": 4,
  					"waysWins": []
  				}
  			]
  		}
  	]
  }
  ```

## Game Mechanics

1. **Symbol Grid**: The grid is 5x3, and symbols are displayed as per the generated configuration.
2. **Wild Symbol**: The middle symbol (reel 3, col 2) is always a wild symbol.
3. **Multiplier**: A random multiplier is selected for the wild symbol.
4. **Winning Calculation**: The paytable is used to calculate winnings for the symbol grid.
5. **Cascading**: If there's a win, the grid is updated and regenerated for up to 5 cascades.

## Paytable

| Symbol ID | 3 Oak | 4 Oak | 5 Oak |
| --------- | ----- | ----- | ----- |
| 1         | 40    | 75    | 150   |
| 2         | 20    | 40    | 80    |
| 3         | 15    | 30    | 60    |
| 4         | 12    | 25    | 50    |
| 5         | 10    | 20    | 40    |
| 6         | 10    | 20    | 40    |
| 7         | 8     | 12    | 25    |
| 8         | 8     | 12    | 25    |
| 9         | 4     | 8     | 16    |

## Reel Configuration

Weighted symbols are used for the reels. The weights determine the likelihood of each symbol appearing.

```json
[
	{ "1": 3, "2": 3, "3": 7, "4": 5, "5": 11, "6": 7, "7": 12, "8": 5, "9": 12 },
	{ "1": 2, "2": 6, "3": 4, "4": 8, "5": 6, "6": 12, "7": 7, "8": 12, "9": 5 },
	{ "1": 3, "2": 3, "3": 7, "4": 5, "5": 11, "6": 7, "7": 12, "8": 5, "9": 12 },
	{ "1": 2, "2": 6, "3": 4, "4": 8, "5": 6, "6": 12, "7": 7, "8": 12, "9": 5 },
	{ "1": 3, "2": 3, "3": 7, "4": 8, "5": 11, "6": 7, "7": 12, "8": 5, "9": 12 }
]
```

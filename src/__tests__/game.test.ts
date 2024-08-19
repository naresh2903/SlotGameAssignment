import request from 'supertest';
import express from 'express';
import router, { cheatTool, forcedPositions } from '../routes/game';

// Create an instance of your Express app
const app = express();
app.use(express.json());
app.use('/game', router);

describe('POST /game/spin', () => {

    test('no_win_scenario', async () => {
        // Define the request body
        const requestBody = {
            bet: 1,
            force: [21, 41, 36, 50, 55, 6, 57, 44, 64, 43, 8, 40, 63, 58, 25, 3] // Optional: include force array if needed
        };

        // Send a POST request to the /spin endpoint
        const response = await request(app)
            .post('/game/spin')
            .send(requestBody);


        // Assertions
        expect(response.body.request.bet).toEqual(1);
        expect(response.body.response[0].symbolGrid).toEqual([
            [5, 7, 7],
            [8, 8, 2],
            [9, 0, 9],
            [7, 3, 7],
            [9, 9, 5]
        ]);
        expect(response.body.response[0].winDetails).toEqual([
            {
                wildMultiplier: 4,
                win: 0,
                accumulatedWin: 0,
                cascadeIndex: 1,
                waysWins: [
                ],
            },
        ]);
    });

    test('win_scenario_wildMultiplier_1', async () => {
        // Define the request body
        const requestBody = {
            bet: 1,
            force: [64, 11, 35, 55, 13, 29, 36, 18, 50, 26, 51, 30, 34, 2, 44, 0, 51, 41, 55, 54, 14, 46, 61, 29, 40, 18, 14] // Optional: include force array if needed
        };

        // Send a POST request to the /spin endpoint
        const response = await request(app)
            .post('/game/spin')
            .send(requestBody);

        //   console.log(response.body);

        // Assertions
        expect(response.body.request.bet).toEqual(1);
        expect(response.body.response).toEqual([
            {
                "symbolGrid": [
                    [9, 3, 6],
                    [8, 4, 6],
                    [7, 0, 8],
                    [6, 8, 6],
                    [6, 1, 7]
                ],
                "totalWin": 80,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 80,
                        "accumulatedWin": 80,
                        "cascadeIndex": 1,
                        "waysWins": [
                            {
                                "symbol": 6,
                                "offsets": [3, 4, 7, 10, 11, 13],
                                "hasWildInWin": true,
                                "totalWin": 80,
                                "ways": 2,
                                "symbolCount": 5
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [8, 9, 3],
                    [7, 8, 4],
                    [9, 7, 8],
                    [4, 8, 8],
                    [7, 1, 7]
                ],
                "totalWin": 104,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 24,
                        "accumulatedWin": 104,
                        "cascadeIndex": 2,
                        "waysWins": [
                            {
                                "symbol": 8,
                                "offsets": [0, 6, 8, 12, 13],
                                "hasWildInWin": false,
                                "totalWin": 24,
                                "ways": 2,
                                "symbolCount": 4
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [9, 9, 3],
                    [6, 7, 4],
                    [7, 9, 7],
                    [4, 4, 4],
                    [7, 1, 7]
                ],
                "totalWin": 104,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 0,
                        "accumulatedWin": 104,
                        "cascadeIndex": 3,
                        "waysWins": []
                    }
                ]
            }
        ]);
    });

    test('win_scenario_wildMultiplier_2', async () => {
        // Define the request body
        const requestBody = {
            bet: 1,
            force: [64, 11, 35, 55, 13, 29, 36, 18, 50, 26, 51, 30, 34, 2, 44, 1, 51, 41, 55, 54, 14, 46, 61, 29, 40, 18, 14] // Optional: include force array if needed
        };

        // Send a POST request to the /spin endpoint
        const response = await request(app)
            .post('/game/spin')
            .send(requestBody);

        //  console.log(response.body);

        // Assertions
        expect(response.body.request.bet).toEqual(1);
        expect(response.body.response).toEqual([
            {
                "symbolGrid": [
                    [9, 3, 6],
                    [8, 4, 6],
                    [7, 0, 8],
                    [6, 8, 6],
                    [6, 1, 7]
                ],
                "totalWin": 80,
                "winDetails": [
                    {
                        "wildMultiplier": 2,
                        "win": 80,
                        "accumulatedWin": 80,
                        "cascadeIndex": 1,
                        "waysWins": [
                            {
                                "symbol": 6,
                                "offsets": [3, 4, 7, 10, 11, 13],
                                "hasWildInWin": true,
                                "totalWin": 80,
                                "ways": 2,
                                "symbolCount": 5
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [8, 9, 3],
                    [7, 8, 4],
                    [9, 7, 8],
                    [4, 8, 8],
                    [7, 1, 7]
                ],
                "totalWin": 104,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 24,
                        "accumulatedWin": 104,
                        "cascadeIndex": 2,
                        "waysWins": [
                            {
                                "symbol": 8,
                                "offsets": [0, 6, 8, 12, 13],
                                "hasWildInWin": false,
                                "totalWin": 24,
                                "ways": 2,
                                "symbolCount": 4
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [9, 9, 3],
                    [6, 7, 4],
                    [7, 9, 7],
                    [4, 4, 4],
                    [7, 1, 7]
                ],
                "totalWin": 104,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 0,
                        "accumulatedWin": 104,
                        "cascadeIndex": 3,
                        "waysWins": []
                    }
                ]
            }
        ]);

    });

    test('max_5_cascades', async () => {
        // Define the request body
        const requestBody = {
            bet: 1,
            force: [2, 5, 11, 1, 19, 19, 2, 17, 17, 1, 19, 19, 2, 20, 20, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 18, 37, 35, 53, 66] // Optional: include force array if needed
        };

        // Send a POST request to the /spin endpoint
        const response = await request(app)
            .post('/game/spin')
            .send(requestBody);

        console.log(response.body);

        // Assertions
        expect(response.body.request.bet).toEqual(1);
        expect(response.body.response).toEqual([
            {
                "symbolGrid": [
                    [1, 2, 3],
                    [1, 4, 4],
                    [1, 0, 4],
                    [1, 4, 4],
                    [1, 4, 4]
                ],
                "totalWin": 300,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 300,
                        "accumulatedWin": 300,
                        "cascadeIndex": 1,
                        "waysWins": [
                            {
                                "symbol": 1,
                                "offsets": [0, 1, 2, 3, 4, 7],
                                "hasWildInWin": true,
                                "totalWin": 300,
                                "ways": 2,
                                "symbolCount": 5
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [1, 2, 3],
                    [1, 4, 4],
                    [1, 1, 4],
                    [1, 4, 4],
                    [1, 4, 4]
                ],
                "totalWin": 600,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 300,
                        "accumulatedWin": 600,
                        "cascadeIndex": 2,
                        "waysWins": [
                            {
                                "symbol": 1,
                                "offsets": [0, 1, 2, 3, 4, 7],
                                "hasWildInWin": false,
                                "totalWin": 300,
                                "ways": 2,
                                "symbolCount": 5
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [1, 2, 3],
                    [1, 4, 4],
                    [1, 1, 4],
                    [1, 4, 4],
                    [1, 4, 4]
                ],
                "totalWin": 900,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 300,
                        "accumulatedWin": 900,
                        "cascadeIndex": 3,
                        "waysWins": [
                            {
                                "symbol": 1,
                                "offsets": [0, 1, 2, 3, 4, 7],
                                "hasWildInWin": false,
                                "totalWin": 300,
                                "ways": 2,
                                "symbolCount": 5
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [1, 2, 3],
                    [1, 4, 4],
                    [1, 1, 4],
                    [1, 4, 4],
                    [1, 4, 4]
                ],
                "totalWin": 1200,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 300,
                        "accumulatedWin": 1200,
                        "cascadeIndex": 4,
                        "waysWins": [
                            {
                                "symbol": 1,
                                "offsets": [0, 1, 2, 3, 4, 7],
                                "hasWildInWin": false,
                                "totalWin": 300,
                                "ways": 2,
                                "symbolCount": 5
                            }
                        ]
                    }
                ]
            },
            {
                "symbolGrid": [
                    [3, 2, 3],
                    [4, 4, 4],
                    [6, 7, 4],
                    [8, 4, 4],
                    [9, 4, 4]
                ],
                "totalWin": 1200,
                "winDetails": [
                    {
                        "wildMultiplier": 1,
                        "win": 0,
                        "accumulatedWin": 1200,
                        "cascadeIndex": 5,
                        "waysWins": []
                    }
                ]
            }
        ]);


    });

});

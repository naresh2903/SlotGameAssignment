import express from 'express';
import gameRouter from './routes/game';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse JSON bodies using body-parser
app.use(bodyParser.json());

// Use the game router
app.use('/game', gameRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

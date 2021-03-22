import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/hola', (req: Request, response: Response) => {
    response.status(200).json({ content: 'jejejejej' })
});

app.listen(port, () => {
    console.log(`Running at port ${port}`);
});
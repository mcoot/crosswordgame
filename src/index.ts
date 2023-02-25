import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use('/', (req: Request, res: Response) => {
  res.send('Hello there :)');
});

app.listen(8080, () => console.log('Express started on port 8080'));

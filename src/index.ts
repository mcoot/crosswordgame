import express, { Request, Response } from 'express';
import expressWs from 'express-ws';

const expressWsInstance = expressWs(express());
const app = expressWsInstance.app;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there :)\n');
});

app.ws('/ws', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(`Got message "${msg}"`);
    ws.send('Thanks for ur message');
  });
});

app.listen(8080, () => console.log('Express started on port 8080'));

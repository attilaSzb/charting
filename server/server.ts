import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

const app = express();

app.use(cors());
app.use(`/data`, express.static(path.join(__dirname, 'data'), { maxAge: 30 }));

// Server
const server = app.listen(process.env.PORT || 3100, () => {
  console.log(`
    Dev server listening on: http://localhost:${server.address().port}
  `);
});

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/api');
const fs = require('fs');
const yaml = require('yaml');
const file = fs.readFileSync('./userPost.yaml', 'utf8')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = yaml.parse(file)



const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use('/', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
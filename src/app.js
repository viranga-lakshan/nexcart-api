const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const env = require('./config/env');
const { helmet, corsOptions, apiLimiter } = require('./middleware/security.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const v1Routes = require('./routes/v1.routes');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

const swaggerServers = [{ url: 'http://localhost:5000/api/v1', description: 'Local development' }];

if (env.PUBLIC_API_URL) {
  swaggerServers.unshift({
    url: `${env.PUBLIC_API_URL}/api/v1`,
    description: 'Live API',
  });
}

swaggerDocument.servers = swaggerServers;

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(apiLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', v1Routes);

app.get('/', (_req, res) => {
  const docsPath = '/api/docs';
  const docsUrl = env.PUBLIC_API_URL ? `${env.PUBLIC_API_URL}${docsPath}` : docsPath;

  res.status(200).json({
    success: true,
    message: 'NexCart API',
    version: '1.0.0',
    docs: docsUrl,
    health: '/api/v1/health',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

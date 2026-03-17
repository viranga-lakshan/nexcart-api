const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { helmet, corsOptions, apiLimiter } = require('./middleware/security.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const v1Routes = require('./routes/v1.routes');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

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
  res.status(200).json({
    success: true,
    message: 'NexCart API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/api/v1/health',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

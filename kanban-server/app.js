const express = require('express');
const compression = require('compression');
const indexRoute = require('./routes/index.routes');
const cors = require('cors');
const helmet = require('helmet');
const connectDb = require('./db/connection');
const path = require('path');

const registerApp = async () => {
	const app = express();
	app.use(compression());
	const registerRoute = (router) => app.use('/api', router);
	app.use(cors());

	app.use(helmet());
	app.use(express.json());
	registerRoute(indexRoute);

	const __dirname1 = path.resolve();

	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname1, '/kanban-app/dist')));
		app.get('*', (req, res) =>
			res.sendFile(
				path.resolve(__dirname1, 'kanban-app', 'dist', 'index.html'),
			),
		);
	} else {
		app.get('/', (req, res) => {
			res.send('API is running..');
		});
	}

	app.get('/health', async (req, res) => {
		try {
			res.send({
				message: 'ok',
				status: 201,
			});
		} catch (error) {
			res.send({
				message: 'Trouble',
				status: 400,
			});
		}
	});

	await connectDb();

	return app;
};

module.exports = registerApp;

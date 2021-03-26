import {NestFactory} from '@nestjs/core';
import {Logger} from '@nestjs/common';
import {AppModule} from './app.module';
import * as config from 'config';

async function bootstrap() {
    const serverConfig = config.get('server');
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('bootstrap');

    // var cors = require('cors');
    // app.use(cors()); // Use this after the variable declaration
    if (process.env.NODE_ENV === 'production') {
        app.enableCors({origin: serverConfig.origin});
        logger.log(`Accepting request from origin "${serverConfig.origin}"`);
    } else {
        app.enableCors();
    }

    const port = process.env.PORT || serverConfig.port;
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}

bootstrap();

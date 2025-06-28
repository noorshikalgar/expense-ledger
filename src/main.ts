import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  ConsoleLogger,
  Logger,
  LogLevel,
  ValidationPipe,
} from '@nestjs/common';
import { HttpErrorFilter } from './common/filters/http-exception.filter';
import { tr } from '@faker-js/faker/.';
import { customSwaggerCss } from './swagger-css';
import { writeFile } from 'fs/promises';
const { openApiToBruno } = require('@usebruno/converters');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1'); // Set a global prefix for all routes
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV') || 'development'; // Or use process.env.NODE_ENV directly

  // Define the log levels you want to use
  const logLevels: LogLevel[] =
    nodeEnv === 'development'
      ? ['log', 'error', 'warn', 'debug', 'verbose'] // All logs in dev
      : ['log', 'error', 'warn']; // Less detailed logs in production

  // Enable Logger with the specific log levels
  app.useLogger(
    new ConsoleLogger({
      logLevels,
      json: Boolean(process.env.LOG_JSON) ?? false,
      prefix: process.env.LOG_PREFIX ?? 'Expense-Manager',
      colors: true, // Enable colors in logs
      timestamp: true, // Include timestamp in logs
      context: 'Expense-Manager', // Context for the logger
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws if unknown properties exist
      transform: true, // automatically transforms payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new HttpErrorFilter());
  const logger = new Logger();
  logger.log('Application init with these log levels: ', logLevels);

  const config = new DocumentBuilder()
    .setTitle('Expense Manager')
    .setDescription('Advance expense tracking manager for normal peoples.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // key used in @ApiBearerAuth('access-token')
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup('api', app, documentFactory);
  const brunoCollection = openApiToBruno(documentFactory());
  try {
    await writeFile(`${process.cwd()}/openapi-collection.json`, JSON.stringify(documentFactory(), null, 2));
    await writeFile(`${process.cwd()}/bruno-collection.json`, JSON.stringify(brunoCollection, null, 2));
    console.log('OpenAPI JSON conversion successful!');
  } catch (error) {
    console.error('Error during OpenAPI JSON conversion:', error);
  }
  // --- IMPORTANT CHANGE HERE ---
  SwaggerModule.setup('api', app, documentFactory, {
    // Add this fourth argument (Swagger UI options)
    customCss: customSwaggerCss,
    swaggerOptions: {
      persistAuthorization: true, // Allows the UI to remember the authorization token
      displayRequestDuration: true, // Displays the request duration in the UI
      tagsSorter: (a: string, b: string) => {
        // 'Auth' is typically the name of your controller/module tag
        if (a === 'Auth') {
          return -1; // 'Auth' comes before 'b'
        }
        if (b === 'Auth') {
          return 1; // 'b' comes before 'Auth'
        }
        // For all other tags, sort alphabetically
        return a.localeCompare(b);
      },
      // You might also want to sort operations within tags
      operationsSorter: 'alpha', // Sorts operations (endpoints) alphabetically within each tag
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
}
bootstrap();

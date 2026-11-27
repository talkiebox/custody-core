import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

const getNumber = (
  configService: ConfigService,
  key: string,
  defaultValue: number,
): number => Number(configService.get<string>(key, String(defaultValue)));

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: getNumber(configService, 'DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'wallet_app'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME', 'portfolio_wallet'),
    autoLoadEntities: true,
    synchronize: configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
    logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
    retryAttempts: getNumber(configService, 'DB_RETRY_ATTEMPTS', 3),
    retryDelay: getNumber(configService, 'DB_RETRY_DELAY', 3000),
  }),
};

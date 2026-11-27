import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponse } from './health.response';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check wallet server health' })
  @ApiOkResponse({ type: HealthResponse })
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'wallet-server',
      timestamp: new Date().toISOString(),
    };
  }
}

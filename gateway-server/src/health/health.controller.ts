import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponse } from './health.response';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check gateway server health' })
  @ApiOkResponse({ type: HealthResponse })
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'gateway-server',
      timestamp: new Date().toISOString(),
    };
  }
}

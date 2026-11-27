import { ApiProperty } from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'gateway-server' })
  service!: string;

  @ApiProperty({ example: '2026-06-27T00:00:00.000Z' })
  timestamp!: string;
}

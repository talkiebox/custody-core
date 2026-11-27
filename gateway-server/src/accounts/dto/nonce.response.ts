import { ApiProperty } from '@nestjs/swagger';

export class NonceResponse {
  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  address!: string;

  @ApiProperty({ example: 7 })
  nonce!: number;

  @ApiProperty({ example: 'pending' })
  blockTag!: string;

  @ApiProperty({ example: '11155111' })
  chainId!: string;
}

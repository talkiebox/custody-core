import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponse {
  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  address!: string;

  @ApiProperty({ example: '1000000000000000000' })
  balanceWei!: string;

  @ApiProperty({ example: '1.0' })
  balance!: string;

  @ApiProperty({ example: 'ETH' })
  symbol!: string;

  @ApiProperty({ example: '11155111' })
  chainId!: string;
}

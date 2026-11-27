import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { BalanceResponse } from './dto/balance.response';
import { NonceResponse } from './dto/nonce.response';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':address/balance')
  @ApiOperation({ summary: 'Get account balance from the configured testnet RPC' })
  @ApiParam({ name: 'address', example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  @ApiOkResponse({ type: BalanceResponse })
  getBalance(@Param('address') address: string): Promise<BalanceResponse> {
    return this.accountsService.getBalance(address);
  }

  @Get(':address/nonce')
  @ApiOperation({ summary: 'Get account nonce from the configured testnet RPC' })
  @ApiParam({ name: 'address', example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  @ApiOkResponse({ type: NonceResponse })
  getNonce(@Param('address') address: string): Promise<NonceResponse> {
    return this.accountsService.getNonce(address);
  }
}

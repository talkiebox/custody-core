import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { formatEther, isAddress, JsonRpcProvider } from 'ethers';
import { BalanceResponse } from './dto/balance.response';
import { NonceResponse } from './dto/nonce.response';

@Injectable()
export class AccountsService {
  private readonly provider: JsonRpcProvider;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');

    if (!rpcUrl) {
      throw new ServiceUnavailableException('BLOCKCHAIN_RPC_URL is not configured.');
    }

    this.provider = new JsonRpcProvider(rpcUrl);
  }

  async getBalance(address: string): Promise<BalanceResponse> {
    this.assertAddress(address);

    const [balanceWei, network] = await Promise.all([
      this.provider.getBalance(address),
      this.provider.getNetwork(),
    ]);

    return {
      address,
      balanceWei: balanceWei.toString(),
      balance: formatEther(balanceWei),
      symbol: 'ETH',
      chainId: network.chainId.toString(),
    };
  }

  async getNonce(address: string): Promise<NonceResponse> {
    this.assertAddress(address);

    const [nonce, network] = await Promise.all([
      this.provider.getTransactionCount(address, 'pending'),
      this.provider.getNetwork(),
    ]);

    return {
      address,
      nonce,
      blockTag: 'pending',
      chainId: network.chainId.toString(),
    };
  }

  private assertAddress(address: string): void {
    if (!isAddress(address)) {
      throw new BadRequestException('Invalid EVM address.');
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

describe('AccountsController', () => {
  let controller: AccountsController;
  const accountsService = {
    getBalance: jest.fn(),
    getNonce: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: accountsService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    jest.clearAllMocks();
  });

  it('returns balance for an address', async () => {
    accountsService.getBalance.mockResolvedValue({
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      balanceWei: '1000000000000000000',
      balance: '1.0',
      symbol: 'ETH',
      chainId: '11155111',
    });

    await expect(controller.getBalance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).resolves.toMatchObject({
      balance: '1.0',
    });
  });

  it('returns nonce for an address', async () => {
    accountsService.getNonce.mockResolvedValue({
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      nonce: 3,
      blockTag: 'pending',
      chainId: '11155111',
    });

    await expect(controller.getNonce('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).resolves.toMatchObject({
      nonce: 3,
    });
  });
});

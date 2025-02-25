import { AuctionEntity } from './auction.entity';
import { BidEntity } from './bid.entity';
import { CardEntity } from './card.entity';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';
import { WalletTransactionEntity } from './wallet-transaction.entity';

export const entities = [UserEntity, BidEntity, CardEntity, WalletTransactionEntity, AuctionEntity, FileEntity];

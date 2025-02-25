import { Auction } from './auction.entity';
import { Bid } from './bid.entity';
import { Card } from './card.entity';
import { User } from './user.entity';
import { WalletTransaction } from './wallet-transaction.entity';

export const entities = [User, Bid, Card, WalletTransaction, Auction];

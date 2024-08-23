import { AuctionStatus } from "./AuctionStatus";

export interface IAuction {
  id: string;
  title: string;
  status: AuctionStatus;
  expirationDate: Date;
  minimumBid: number;
  bids: Bid[];
}

export class Auction {
  id: string;
  title: string;
  status: AuctionStatus;
  expirationDate: Date;
  minimumBid: number;
  bids: Bid[];

  constructor(
    id: string,
    title: string,
    status: AuctionStatus,
    expirationDate: Date,
    minimumBid: number
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.expirationDate = expirationDate;
    this.minimumBid = minimumBid;
    this.bids = [];
  }

  public getAuctionValue(): IAuction {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      expirationDate: this.expirationDate,
      minimumBid: this.minimumBid,
      bids: this.bids,
    };
  }

  public getHighestBid(): Bid | undefined {
    if (this.bids.length === 0) {
      return;
    }
    return this.bids.at(-1);
  }
}


export interface Bid {
  bidderId: string;
  value: number;
}

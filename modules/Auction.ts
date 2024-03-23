import { AuctionStatus } from "./AuctionStatus";

export class Auction {
    id: string;
    title: string;
    status: AuctionStatus;
    expirationDate: Date;
    minimumBid: number;
    bids: Bid[];

    constructor(id: string, title: string, status: AuctionStatus, expirationDate: Date, minimumBid: number) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.expirationDate = expirationDate;
        this.minimumBid = minimumBid;
        this.bids = [];
    }

    public getHighestBid(): Bid | null {
        if (this.bids.length === 0) {
            return null;
        }
        return this.bids.reduce((prev, current) => (prev.value > current.value ? prev : current));
    }

}

export interface Bid {
    bidderId: string;
    value: number;
}
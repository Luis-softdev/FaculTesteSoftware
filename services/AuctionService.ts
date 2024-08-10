import { Auction, Bid, IAuction } from "../modules/Auction";
import { AuctionStatus } from "../modules/AuctionStatus";
import { User } from "../modules/Users";

export class AuctionService {
  private auctions: Auction[];
  private users: User[];

  constructor() {
    this.auctions = [];
    this.users = [];
  }

  // Método para adicionar um novo usuário
  public addUser(user: User): void {
    this.users.push(user);
  }

  // Método para adicionar um novo leilão
  public addAuction(auction: Auction): void {
    this.auctions.push(auction);
  }

  // Método para adicionar um lance a um leilão
  public placeBid(auctionId: string, bidderId: string, value: number): boolean {
    const auction = this.auctions.find((auction) => auction.id === auctionId);
    const bidder = this.users.find((user) => user.id === bidderId);

    if (
      !auction ||
      !bidder ||
      auction.status !== AuctionStatus.ABERTO ||
      value < auction.minimumBid
    ) {
      return false;
    }

    const lastBid =
      auction.bids.length > 0
        ? auction.bids[auction.bids.length - 1].value
        : auction.minimumBid;
    console.log(lastBid);

    if (value <= lastBid || auction.bids.at(-1)?.bidderId === bidderId) {
      return false;
    }

    auction.bids.push({ bidderId, value });
    return true;
  }

  // Método para obter o maior lance para um leilão
  public getHighestBidForAuction(auctionId: string): Bid | null {
    const auction = this.auctions.find((auction) => auction.id === auctionId);
    if (!auction || auction.bids.length === 0) {
      return null;
    }
    return auction.getHighestBid();
  }

  // Método para obter o menor lance para um leilão
  public getLowestBidForAuction(auctionId: string): Bid | null {
    const auction = this.auctions.find((auction) => auction.id === auctionId);
    if (!auction || auction.bids.length === 0) {
      return null;
    }
    return auction.bids.reduce((prev, current) =>
      prev.value < current.value ? prev : current
    );
  }

  // Método para obter a lista de lances para um leilão em ordem crescente de valor
  public getBidsForAuction(auctionId: string): Bid[] | null {
    const auction = this.auctions.find((auction) => auction.id === auctionId);
    console.log(auction);

    if (!auction) {
      return null;
    }
    return auction.bids.sort((a, b) => b.value - a.value);
  }

  public getAllAuctions(): IAuction[] {
    return this.auctions.map((auction) => auction.getAuctionValue());
  }
}

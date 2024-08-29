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

    if (value <= lastBid || auction.bids.at(-1)?.bidderId === bidderId) {
      return false;
    }

    auction.bids.push({ bidderId, value });
    return true;
  }

  // Método para obter o maior lance para um leilão
  public getHighestBidForAuction(auctionId: string): Bid | undefined {
    const auction = this.auctions.find((auction) => auction.id === auctionId);
    if (!auction || auction.bids.length === 0) {
      return;
    }
    return auction.getHighestBid();
  }

  // Método para obter o menor lance para um leilão
  public getLowestBidForAuction(auctionId: string): Bid | null {
    const auction = this.auctions.find((auction) => auction.id === auctionId);
    if (!auction || auction.bids.length === 0) {
      return null;
    }
    return auction.bids[0] 
  }

  // Método para obter a lista de lances para um leilão em ordem crescente de valor
  public getBidsForAuction(auctionId: string): Bid[] | undefined {
    const auction = this.auctions.find((auction) => auction.id === auctionId);

    if (!auction) {
      return;
    }
    const bids = auction.bids.sort((a, b) => b.value - a.value);
    console.table(bids);
    return bids
  }

  public getAllAuctions(): IAuction[] {
    return this.auctions.map((auction) => auction.getAuctionValue());
  }

  public finalizeAuction(auctionId: string): { message: string; email?: string; auction?: Auction; status: number } {
    const auction = this.auctions.find((auction) => auction.id === auctionId);

    if (!auction || auction.status !== AuctionStatus.ABERTO) {
      return {
        message: 'Leilão não encontrado ou já finalizado.',
        status: 404
      };
    }

    auction.status = AuctionStatus.FINALIZADO;
    const bids = auction.bids;
    const lastBid: Bid | undefined = bids.length > 0 ? bids[bids.length - 1] : undefined;

    if (lastBid) {
      const winner = this.users.find((user) => user.id === lastBid.bidderId)?.name || 'Desconhecido';
      const emailMessage = `Parabéns! Você é o vencedor, ${winner}!`;

      return {
        message: 'Leilão finalizado com sucesso!',
        email: emailMessage,
        auction: auction,
        status: 200
      };
    } else {
      return {
        message: 'Leilão finalizado sem lances.',
        auction: auction,
        status: 200
      };
    }
  }
}

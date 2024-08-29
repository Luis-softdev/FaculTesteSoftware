import { AuctionService } from "../services/AuctionService";
import { Auction } from "../modules/Auction";
import { User } from "../modules/Users";
import { AuctionStatus } from "../modules/AuctionStatus";

describe("AuctionService", () => {
  let auctionService: AuctionService;
  let mockUser: User;
  let mockAuction: Auction;

  beforeEach(() => {
    auctionService = new AuctionService();

    mockUser = { id: 'user1', name: 'João Silva' } as User;
    auctionService.addUser(mockUser);

    mockAuction = {
      id: 'auction1',
      status: AuctionStatus.ABERTO,
      minimumBid: 100,
      bids: []
    } as unknown as Auction;

    auctionService.addAuction(mockAuction);
  });

  it('deve finalizar o leilão com sucesso quando há lances', () => {
    
    const bid = { bidderId: 'user1', value: 200 };
    mockAuction.bids.push(bid);

    const resultado = auctionService.finalizeAuction('auction1');

    expect(resultado.message).toBe('Leilão finalizado com sucesso!');
    expect(resultado.email).toBe('Parabéns! Você é o vencedor, João Silva!');
    expect(resultado.auction?.status).toBe(AuctionStatus.FINALIZADO);
    expect(resultado.status).toBe(200);
  });

  it('deve retornar mensagem para leilão finalizado sem lances', () => {

    const resultado = auctionService.finalizeAuction('auction1');

    expect(resultado.message).toBe('Leilão finalizado sem lances.');
    expect(resultado.email).toBeUndefined();
    expect(resultado.auction?.status).toBe(AuctionStatus.FINALIZADO);
    expect(resultado.status).toBe(200);
  });

  it('deve retornar erro se o leilão não for encontrado ou já estiver finalizado', () => {
    const resultado1 = auctionService.finalizeAuction('leilaoInexistente');
    
    const resultado2 = auctionService.finalizeAuction('auction1');
    
    auctionService.finalizeAuction('auction1');
    
    const resultado3 = auctionService.finalizeAuction('auction1');
  
    expect(resultado1.message).toBe('Leilão não encontrado ou já finalizado.');
    expect(resultado1.status).toBe(404);
  
    expect(resultado2.message).toBe('Leilão finalizado sem lances.');
    expect(resultado2.status).toBe(200);
  
    expect(resultado3.message).toBe('Leilão não encontrado ou já finalizado.');
    expect(resultado3.status).toBe(404);
  });
});

import { AuctionService } from "../services/AuctionService";
import { Auction } from "../modules/Auction";
import { User } from "../modules/Users";
import { AuctionStatus } from "../modules/AuctionStatus";

describe("AuctionService", () => {
  let auctionService: AuctionService;

  beforeEach(() => {
    auctionService = new AuctionService();
  });

  describe("Testes da função placeBid", () => {
    it("deve retornar o maior lance para um leilão", () => {
      const user = new User("1", "Usuário Teste");
      auctionService.addUser(user);

      const auction = new Auction(
        "1",
        "Leilão Teste",
        AuctionStatus.ABERTO,
        new Date("2024-03-10"),
        100
      );
      auctionService.addAuction(auction);

      auctionService.placeBid("1", "1", 150);

      const highestBid = auctionService.getHighestBidForAuction("1");
      expect(highestBid).toEqual({ bidderId: "1", value: 150 });
    });

    it("não deve inserir um lance caso o status da auction não seja aberto", () => {
      const user = new User("1", "Tony");
      auctionService.addUser(user);

      const auction = new Auction(
        "1",
        "Onix 1.0",
        AuctionStatus.EXPIRADO,
        new Date("2024-03-10"),
        100
      );
      auctionService.addAuction(auction);

      const result = auctionService.placeBid("1", "1", 150);

      expect(result).toBe(false);
    });

    it("não deve inserir um lance se não existir um leilão", () => {
      const user = new User("5", "Gabriel");
      auctionService.addUser(user);

      const result = auctionService.placeBid("99", "5", 250);

      expect(result).toBe(false);
    });

    it("não deve inserir um lance se não existir um usuário", () => {

      const auction = new Auction(
        "1",
        "Boi Nelore",
        AuctionStatus.ABERTO,
        new Date("2024-03-10"),
        300
      );
      auctionService.addAuction(auction);

      const result = auctionService.placeBid("1", "99", 300);

      expect(result).toBe(false);
    });

    it("não deve inserir um lance se o valor for menor do que o valor mínimo", () => {
      const user = new User("1", "Elon");
      auctionService.addUser(user);

      const auction = new Auction(
        "1",
        "Máquina de Lavar",
        AuctionStatus.ABERTO,
        new Date("2024-03-10"),
        100
      );
      auctionService.addAuction(auction);

      const result = auctionService.placeBid("1", "1", 50);

      expect(result).toBe(false);
    });

    it("não deve inserir um lance se o valor for menor ou igual ao lance anterior", () => {
      const user = new User("1", "Fran");
      auctionService.addUser(user);

      const auction = new Auction(
        "1",
        "Jogo de Cartas",
        AuctionStatus.ABERTO,
        new Date("2024-03-10"),
        100
      );
      auctionService.addAuction(auction);

      // Lance inicial
      auctionService.placeBid('1', '1', 150);

      // Tentando inserir um lance igual
      const resultEqual = auctionService.placeBid("1", "1", 150);
      expect(resultEqual).toBe(false);

      // Tentando inserir um lance menor
      const resultLower = auctionService.placeBid("1", "1", 100);
      expect(resultLower).toBe(false);
    });
  });

  describe("Testes da função getHighestBidForAuction", () => {
    it('deve retornar null se o leilão não existir', () => {
      const result = auctionService.getHighestBidForAuction('9999');
      expect(result).toBeUndefined();
    });

    it('deve retornar null se o leilão não tiver lances', () => {
      const auction = new Auction(
        '1',
        'Moto Honda',
        AuctionStatus.ABERTO,
        new Date('2024-03-10'),
        100);

      auctionService.addAuction(auction);

      const result = auctionService.getHighestBidForAuction('1');
      expect(result).toBeUndefined();
    });

    it('deve retornar o maior lance se o leilão tiver lances', () => {
      const user1 = new User('1', 'Luisim');
      const user2 = new User('2', 'Luisão');
      auctionService.addUser(user1);
      auctionService.addUser(user2);

      const auction = new Auction(
        '1',
        'Iphone 16',
        AuctionStatus.ABERTO,
        new Date('2024-03-10'),
        100);
      auctionService.addAuction(auction);

      auctionService.placeBid('1', '1', 150);
      auctionService.placeBid('1', '2', 200);

      const result = auctionService.getHighestBidForAuction('1');
      expect(result).toEqual({ bidderId: '2', value: 200 });
    });

  });

  describe("Teste para a função getHighestBid", () => {
    it('deve retornar null se não houver lances para o leilão', () => {

      const auction = new Auction(
        "1",
        "HRV",
        AuctionStatus.ABERTO,
        new Date("2024-03-10"),
        100
      );
      auctionService.addAuction(auction);

      const result = auction.getHighestBid();
      expect(result).toBeUndefined();
    });

  });

  describe("Testes para a função getLowestBidForAuction", () => {
    it('deve retornar null se o leilão não existir', () => {
      const result = auctionService.getLowestBidForAuction('99');
      expect(result).toBeNull();
    });

    it('deve retornar null se o leilão não tiver lances', () => {
      const auction = new Auction('1', 'Leilão Sem Lances', AuctionStatus.ABERTO, new Date('2024-03-10'), 100);
      auctionService.addAuction(auction);

      const result = auctionService.getLowestBidForAuction('1');
      expect(result).toBeNull();
    });

    it('deve retornar o menor lance entre múltiplos lances', () => {
      const user1 = new User('1', 'Usuário Teste 1');
      const user2 = new User('2', 'Usuário Teste 2');
      auctionService.addUser(user1);
      auctionService.addUser(user2);

      const auction = new Auction('1', 'Leilão Teste', AuctionStatus.ABERTO, new Date('2024-03-10'), 100);
      auctionService.addAuction(auction);

      auctionService.placeBid('1', user1.id, 200);
      auctionService.placeBid('1', user2.id, 300);
      auctionService.placeBid('1', user1.id, 400);
      console.log(auction.bids);
      

      const result = auctionService.getLowestBidForAuction('1');
      expect(result).toEqual({ bidderId: '1', value: 200 });
    });

    it('deve retornar o único lance quando houver apenas um lance', () => {
      const user = new User('1', 'Usuário Teste');
      auctionService.addUser(user);

      const auction = new Auction('1', 'Leilão Teste', AuctionStatus.ABERTO, new Date('2024-03-10'), 100);
      auctionService.addAuction(auction);

      auctionService.placeBid('1', user.id, 200);

      const result = auctionService.getLowestBidForAuction('1');
      expect(result).toEqual({ bidderId: '1', value: 200 });
    });
    
  });

  describe("Testes para a função getBidsForAuction", () => {
    it('deve retornar null se o leilão não existir', () => {
      const result = auctionService.getBidsForAuction('9999');
      expect(result).toBeUndefined();
    });
  });

  describe("Testes para a função finalizeAuction", () => {

  });

  it("deve retornar a lista de lances para um leilão em ordem crescente de valor", () => {
    const user1 = new User("1", "Usuário Teste 1");
    const user2 = new User("2", "Usuário Teste 2");
    auctionService.addUser(user1);
    auctionService.addUser(user2);

    const auction = new Auction(
      "1",
      "Leilão Teste",
      AuctionStatus.ABERTO,
      new Date("2024-03-10"),
      100
    );
    auctionService.addAuction(auction);

    auctionService.placeBid("1", user1.id, 120);
    auctionService.placeBid("1", user2.id, 150);
    auctionService.placeBid("1", user1.id, 200);

    const bids = auctionService.getBidsForAuction("1");

    expect(bids).toEqual([
      { bidderId: user1.id, value: 200 },
      { bidderId: user2.id, value: 150 },
      { bidderId: user1.id, value: 120 },
    ]);
  });

  it("Deve retornar todos os leilões", () => {
    const user1 = new User("1", "Gustavo");
    const user2 = new User("2", "Luis");

    auctionService.addUser(user1);
    auctionService.addUser(user2);

    const auction1 = new Auction(
      "1",
      "Leilão Teste",
      AuctionStatus.ABERTO,
      new Date("2024-03-10"),
      100
    );
    const auction2 = new Auction(
      "2",
      "Leilão Teste 2",
      AuctionStatus.FINALIZADO,
      new Date("2024-03-10"),
      100
    );
    auctionService.addAuction(auction1);
    auctionService.addAuction(auction2);

    const result = auctionService.getAllAuctions();

    expect(result).toEqual([
      {
        id: "1",
        title: "Leilão Teste",
        status: "ABERTO",
        expirationDate: new Date("2024-03-10T00:00:00.000Z"),
        minimumBid: 100,
        bids: [],
      },
      {
        id: "2",
        title: "Leilão Teste 2",
        status: "FINALIZADO",
        expirationDate: new Date("2024-03-10T00:00:00.000Z"),
        minimumBid: 100,
        bids: [],
      },
    ]);
  });


});

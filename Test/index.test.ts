import { AuctionService } from '../services/AuctionService';
import { Auction } from '../modules/Auction';
import { User } from '../modules/Users';
import { AuctionStatus } from '../modules/AuctionStatus';

describe('AuctionService', () => {
    let auctionService: AuctionService;

    beforeEach(() => {
        auctionService = new AuctionService();
    });

    it('deve retornar o maior lance para um leilão', () => {
        const user = new User('1', 'Usuário Teste');
        auctionService.addUser(user);

        const auction = new Auction('1', 'Leilão Teste', AuctionStatus.ABERTO, new Date('2024-03-10'), 100);
        auctionService.addAuction(auction);

        auctionService.placeBid('1', '1', 150);

        const highestBid = auctionService.getHighestBidForAuction('1');
        expect(highestBid).toEqual({ bidderId: '1', value: 150 });
    });

    it('deve retornar o menor lance para um leilão', () => {
        const user = new User('1', 'Usuário Teste');
        auctionService.addUser(user);

        const auction = new Auction('1', 'Leilão Teste', AuctionStatus.ABERTO, new Date('2024-03-10'), 100);
        auctionService.addAuction(auction);

        auctionService.placeBid('1', '1', 150);

        const lowestBid = auctionService.getLowestBidForAuction('1');
        expect(lowestBid).toEqual({ bidderId: '1', value: 150 });
    });

    it('deve retornar a lista de lances para um leilão em ordem crescente de valor', () => {
        const user1 = new User('1', 'Usuário Teste 1');
        const user2 = new User('2', 'Usuário Teste 2');
        auctionService.addUser(user1);
        auctionService.addUser(user2);

        const auction = new Auction('1', 'Leilão Teste', AuctionStatus.ABERTO, new Date('2024-03-10'), 100);
        auctionService.addAuction(auction);

        auctionService.placeBid('1', user1.id, 120);
        auctionService.placeBid('1', user2.id, 150);
        auctionService.placeBid('1', user1.id, 200);

        const bids = auctionService.getBidsForAuction('1');
        console.log(bids);

        expect(bids).toEqual([
            { bidderId: user1.id, value: 200 },
            { bidderId: user2.id, value: 150 },
            { bidderId: user1.id, value: 120 }
        ]);
    });
});

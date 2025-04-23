import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/Game";


export class Loan {
    id: number = 0;
    fechainic: Date = new Date();
    fechafin: Date = new Date();
    client: Client = new Client();
    game: Game = new Game();
}
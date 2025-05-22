import { Pageable } from "../../core/model/page/Pageable";
import { Author } from "./Author";

export class AuthorPage {
    content: Author[] = [];
    pageable: Pageable = new Pageable();
    totalElements: number = 0;
} 
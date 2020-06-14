import { BehaviorSubject } from "rxjs";
import { Library } from "../types/library";
import { StateService } from "../services/state.service";
import { SearchPins } from "../types/search-pins";

export class ArtistListElement {
    private component: HTMLUListElement;

    constructor(private parentElement: HTMLElement,
        private library$: BehaviorSubject<Library>,
        private stateService: StateService) {
        this.component = document.createElement('ul');
        this.init();
    }

    init(): void {
        this.library$.subscribe((libraryData: Library) => {
            this.component.textContent = '';
            libraryData.getArtists().forEach((entry: string) => {
                let listEntry = document.createElement('li');
                listEntry.innerText = entry;
                listEntry.setAttribute('artist', entry);
                listEntry.onclick = (event) => {
                    this.pinAlbum(event);
                }
                this.component.appendChild(listEntry);
            });
            this.parentElement.appendChild(this.component);
        });
    }

    private pinAlbum(event: MouseEvent): void {
        const listElement = <HTMLElement>event.srcElement;
        this.stateService.setCurrentSearchPins(new SearchPins(listElement.getAttribute('artist') ?? '', ''));
    }
}
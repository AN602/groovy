import { BehaviorSubject } from "rxjs";
import { Library, LibraryEntry } from "../types/library";
import { StateService } from "../services/state.service";

export class SongListComponent {
    private component: HTMLUListElement;

    constructor(private parentElement: HTMLElement,
        private stateService: StateService,
        private library$: BehaviorSubject<Library>) {
        this.component = document.createElement('ul');
        this.init();
    }

    init(): void {
        this.library$.subscribe((libraryData: Library) => {
            this.component.textContent = '';
            libraryData.getEntries().forEach((entry: LibraryEntry) => {
                let listEntry = document.createElement('li');
                listEntry.innerText = entry.getTitle() ?? 'NO DATA';
                listEntry.setAttribute('filePath', entry.getFilePath());
                listEntry.onclick = (event) => {
                    this.setAudioFile(event);
                }
                this.component.appendChild(listEntry);
            });
            this.parentElement.appendChild(this.component);
        });
    }

    private setAudioFile(event: MouseEvent): void {
        const listElement = <HTMLElement>event.srcElement;
        this.stateService.setCurrentAudioFile(listElement.getAttribute('filePath') ?? '');
    }
}
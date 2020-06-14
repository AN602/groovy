import { LibraryService } from "./services/library.service";
import { StateService } from "./services/state.service";
import { PlayerComponent } from "./components/player.component";
import { SearchComponent } from "./components/search.component";
import { SongListComponent } from "./components/song-list.component";
import { AlbumListElement } from "./components/album-list.component";
import { ArtistListElement } from "./components/artist-list-component";

import './style.scss';

class App {
    private libraryService: LibraryService;
    private stateService: StateService;

    private appElement: HTMLElement;
    private playerContainerElement: HTMLElement;
    private searchContainerElement: HTMLElement;
    private fileListContainerElement: HTMLElement;
    private artistListContainerElement: HTMLElement;
    private albumListContainerElement: HTMLElement;

    private songViewButton: HTMLButtonElement;
    private artistViewButton: HTMLButtonElement;
    private albumViewButton: HTMLButtonElement;

    private currentView: boolean = false;

    constructor() {
        this.appElement = document.createElement('div');
        document.body.appendChild(this.appElement);

        this.libraryService = LibraryService.getInstance();
        this.stateService = StateService.getInstance();

        this.playerContainerElement = document.createElement('div');
        new PlayerComponent(this.playerContainerElement, this.stateService);

        this.searchContainerElement = document.createElement('div');
        new SearchComponent(this.searchContainerElement, this.stateService);

        this.fileListContainerElement = document.createElement('div');
        new SongListComponent(this.fileListContainerElement, this.stateService, this.libraryService.getLibrarySet());

        this.artistListContainerElement = document.createElement('div');
        this.artistListContainerElement.style.display = 'none';
        new ArtistListElement(this.artistListContainerElement, this.libraryService.getLibrarySet(), this.stateService);

        this.albumListContainerElement = document.createElement('div');
        this.albumListContainerElement.style.display = 'none';
        new AlbumListElement(this.albumListContainerElement, this.libraryService.getLibrarySet(), this.stateService);

        this.songViewButton = document.createElement('button');
        this.songViewButton.innerText = 'Songs';
        this.songViewButton.addEventListener('click', () => this.switchView('song'));
        this.songViewButton.disabled = true;

        this.artistViewButton = document.createElement('button');
        this.artistViewButton.innerText = 'Artists';
        this.artistViewButton.addEventListener('click', () => this.switchView('artist'));

        this.albumViewButton = document.createElement('button');
        this.albumViewButton.innerText = 'Albums';
        this.albumViewButton.addEventListener('click', () => this.switchView('album'));

        this.appElement.append(this.playerContainerElement);
        this.appElement.append(this.searchContainerElement);
        this.appElement.append(this.songViewButton);
        this.appElement.append(this.artistViewButton);
        this.appElement.append(this.albumViewButton);
        this.appElement.append(this.fileListContainerElement);
        this.appElement.append(this.artistListContainerElement);
        this.appElement.append(this.albumListContainerElement);
    }

    switchView(viewId: string): void {
        this.songViewButton.disabled = false;
        this.artistViewButton.disabled = false;
        this.albumViewButton.disabled = false;
        switch (viewId) {
            case 'song':
                this.fileListContainerElement.style.display = 'block';
                this.artistListContainerElement.style.display = 'none';
                this.albumListContainerElement.style.display = 'none';
                this.songViewButton.disabled = true;
                break;
            case 'artist':
                this.fileListContainerElement.style.display = 'none';
                this.artistListContainerElement.style.display = 'block';
                this.albumListContainerElement.style.display = 'none';
                this.artistViewButton.disabled = true;
                break;
            case 'album':
                this.fileListContainerElement.style.display = 'none';
                this.artistListContainerElement.style.display = 'none';
                this.albumListContainerElement.style.display = 'block';
                this.albumViewButton.disabled = true;
                break;
            default:
                return;

        }
    }
}

let app = new App();
import { BehaviorSubject, combineLatest } from "rxjs";
import { createWriteStream } from 'fs';
import { join } from 'path';
import { LoaderService } from "./loader.service";
import { LibraryEntry, Library } from "../types/library";
import { StateService } from "./state.service";
import { SearchPins } from "../types/search-pins";

export class LibraryService {
    private static instance: LibraryService;

    private stateService: StateService;
    private loaderService: LoaderService;
    private librarySet$: BehaviorSubject<Library> = new BehaviorSubject<Library>(new Library());
    private library: Library = new Library();

    private constructor() {
        this.stateService = StateService.getInstance();
        combineLatest(this.stateService.getCurrentSearch(), this.stateService.getCurrentSearchPins())
            .subscribe((data: any) => {
                this.reduceLibrarySet(data[0], data[1]);
            });

        this.loaderService = LoaderService.getInstance();
        this.loaderService.loadLibrary().then((libraryData: Library) => {
            this.library = libraryData;
            this.librarySet$.next(libraryData);
            this.writeCurrentLibraryToDisk();
        })
    }

    public static getInstance(): LibraryService {
        if (!LibraryService.instance) {
            LibraryService.instance = new LibraryService();
        }

        return LibraryService.instance;
    }

    public getLibrarySet(): BehaviorSubject<Library> {
        return this.librarySet$;
    }

    private reduceLibrarySet(searchValue: string, searchPins: SearchPins): void {
        console.time('searchPerformance');
        let tempLibrarySet = new Library();
        console.info(searchPins);
        this.library.getEntries().forEach((entry: LibraryEntry) => {
            if (searchPins.pinnedArtist && entry.getArtist() !== searchPins.pinnedArtist) {
                return;
            }

            if (searchPins.pinnedAlbum && entry.getAlbum() !== searchPins.pinnedAlbum) {
                return;
            }

            if (entry.includes(searchValue)) {
                tempLibrarySet.addEntry(entry);
            }
        })
        this.librarySet$.next(tempLibrarySet);
        console.timeEnd('searchPerformance');
    }

    private async writeCurrentLibraryToDisk(): Promise<void> {
        let outputStream = createWriteStream(join(__dirname, 'library.json'))
            .on('finish', () => {
                console.info('stream finished');
            })
            .on('error', (error) => {
                console.error(error);
            });
        this.library.getEntries().forEach((entry: LibraryEntry, index: number) => {
            outputStream.write(JSON.stringify(entry));
        });
        outputStream.end();
    }
}
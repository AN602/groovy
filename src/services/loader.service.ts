import { readdir } from "fs";
import { extname, join } from "path";
import { BehaviorSubject, Subject } from "rxjs";
import { skip, takeUntil } from "rxjs/operators";
import { parseFile, IAudioMetadata } from 'music-metadata';
import { Library, LibraryEntry } from "../types/library";

export class LoaderService {
    private static instance: LoaderService;
    static supportedFileTypes = [".mp3", ".flac"];
    static libraryPath = "C:\\Users\\BOSD\\Music";

    private loaderCounter: BehaviorSubject<number>;
    private concurrentLoaders: number = 0;

    private constructor() {
        this.loaderCounter = new BehaviorSubject<number>(0);
    }

    public static getInstance(): LoaderService {
        if (!LoaderService.instance) {
            LoaderService.instance = new LoaderService();
        }

        return LoaderService.instance;
    }

    private getLoaderCounter(): BehaviorSubject<number> {
        return this.loaderCounter;
    }

    private incrementLoaderCounter() {
        this.loaderCounter.next(this.loaderCounter.value + 1);
    }

    private decrementLoaderCounter() {
        this.loaderCounter.next(this.loaderCounter.value - 1);
    }

    // TODO parseFile extremely slow, use worker thread for parallel parsing
    private async readLibrary(filePath: string, library: Library): Promise<void> {
        this.incrementLoaderCounter();
        parseFile(filePath).then((data: IAudioMetadata) => {
            library.addEntry(new LibraryEntry(filePath, data.common.title, data.common.artist, data.common.album));
            this.decrementLoaderCounter();
        }).catch((error) => {
            console.error(error);
            this.decrementLoaderCounter();
        });
    }

    private async loadFilesRecursive(pathStub: string, library: Library): Promise<void> {
        this.incrementLoaderCounter();

        readdir(pathStub, { withFileTypes: true }, (error, files) => {
            files.forEach((data) => {
                if (error) {
                    console.log(`something went horrible wrong ${error}`);
                }

                if (data.isDirectory()) {
                    this.loadFilesRecursive(join(pathStub, data.name), library);
                } else if (
                    LoaderService.supportedFileTypes.includes(extname(data.name))
                ) {
                    this.readLibrary(join(pathStub, data.name), library);
                } else {
                    /* console.info(
                        `error in ${data.name} unsupported file type ${extname(data.name)}`
                    ); */
                }
            });
            // console.info(`successfully parsed ${files.length} files in sub-loader`);
            this.decrementLoaderCounter();
        });
    }

    public async loadLibrary(): Promise<Library> {
        return new Promise<Library>((resolve, _reject) => {
            const library: Library = new Library();
            const unsubscribe = new Subject<any>();

            console.info("start loading files");
            console.time('loaderPerformance');
            const loaderService = LoaderService.getInstance();
            loaderService
                .getLoaderCounter()
                .pipe(skip(1), takeUntil(unsubscribe))
                .subscribe((counter) => {
                    if (counter > this.concurrentLoaders) {
                        this.concurrentLoaders = counter;
                    }
                    if (counter === 0) {
                        unsubscribe.next();
                        resolve(library);
                        console.timeEnd('loaderPerformance');
                        console.info(`successfully loaded ${library.getLibrarySizeToString()}, max amount of concurrent loaders was ${this.concurrentLoaders}`);
                    }
                });

            this.loadFilesRecursive(LoaderService.libraryPath, library);
        });
    }
}

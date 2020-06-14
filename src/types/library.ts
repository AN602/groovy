export class Library {
    constructor(private albums: string[] = new Array<string>(),
        private artists: string[] = new Array<string>(),
        private entries: LibraryEntry[] = new Array<LibraryEntry>()) { }

    addEntry(entry: LibraryEntry): void {
        if (!this.entries.includes(entry)) {
            this.addArtist(entry.getArtist() ?? 'UNKNOWN ARTIST');
            this.addAlbum(entry.getAlbum() ?? 'UNKNOWN ALBUM');
            this.entries.push(entry);
        }
    }

    addArtist(artist: string): void {
        if (!this.artists.includes(artist)) {
            this.artists.push(artist);
        }
    }

    addAlbum(album: string): void {
        if (!this.albums.includes(album)) {
            this.albums.push(album);
        }
    }

    getEntries(): LibraryEntry[] {
        return this.entries;
    }

    getAlbums(): string[] {
        return this.albums;
    }

    getArtists(): string[] {
        return this.artists;
    }

    getLibrarySize(): { albums: number, artists: number, entries: number } {
        return {
            albums: this.albums.length,
            artists: this.artists.length,
            entries: this.entries.length
        }
    }

    getLibrarySizeToString(): string {
        return `albums: ${this.albums.length}, artists: ${this.artists.length}, entries: ${this.entries.length}`;
    }
}

export class LibraryEntry {

    constructor(private filePath: string,
        private title: string | undefined,
        private artist: string | undefined,
        private album: string | undefined) { }

    includes(searchString: string): boolean {
        if (this.title?.includes(searchString)) {
            return true;
        }
        if (this.artist?.includes(searchString)) {
            return true;
        }
        if (this.album?.includes(searchString)) {
            return true;
        }
        return false;
    }

    getFilePath(): string {
        return this.filePath;
    }

    getTitle(): string | undefined {
        return this.title;
    }

    getArtist(): string | undefined {
        return this.artist;
    }

    getAlbum(): string | undefined {
        return this.album;
    }
}
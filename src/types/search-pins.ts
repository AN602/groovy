export class SearchPins {
    constructor(private _pinnedArtist: string = '',
        private _pinnedAlbum: string = '') { }

    get pinnedArtist(): string {
        return this._pinnedArtist;
    }

    get pinnedAlbum(): string {
        return this._pinnedAlbum;
    }
}
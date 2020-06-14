import { BehaviorSubject } from "rxjs";
import { SearchPins } from "../types/search-pins";

export class StateService {
    private static instance: StateService;
    private currentAudioFile$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private currentSearch$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private currentSearchPins$: BehaviorSubject<SearchPins> = new BehaviorSubject<SearchPins>(new SearchPins());
    private currentView$: BehaviorSubject<string> = new BehaviorSubject<string>('songs');

    private constructor() { }

    public static getInstance(): StateService {
        if (!StateService.instance) {
            StateService.instance = new StateService();
        }

        return StateService.instance;
    }

    public getCurrentAudioFile(): BehaviorSubject<string> {
        return this.currentAudioFile$;
    }

    public setCurrentAudioFile(audioFile: string): void {
        this.currentAudioFile$.next(audioFile);
    }

    public getCurrentSearch(): BehaviorSubject<string> {
        return this.currentSearch$;
    }

    public setCurrentSearch(search: string): void {
        this.currentSearch$.next(search);
    }

    public getCurrentSearchPins(): BehaviorSubject<SearchPins> {
        return this.currentSearchPins$;
    }

    public setCurrentSearchPins(searchPins: SearchPins): void {
        this.currentSearchPins$.next(searchPins);
    }
}
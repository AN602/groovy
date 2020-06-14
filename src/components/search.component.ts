import { debounce } from "../utils/debounce";
import { StateService } from "../services/state.service";
import { SearchPins } from "../types/search-pins";

export class SearchComponent {
    private searchElement: HTMLInputElement;
    private resetButton: HTMLButtonElement;

    // TODO proper service injection for components
    constructor(private parentElement: HTMLElement, private stateService: StateService) {
        this.searchElement = document.createElement('input');
        this.searchElement.type = 'text';
        this.searchElement.addEventListener('input',
            debounce((event: Event) => this.executeSearch(event), 50)
        );

        this.resetButton = document.createElement('button');
        this.resetButton.innerText = 'reset';
        this.resetButton.onclick = () => {
            this.resetSearch();
        }

        this.parentElement.appendChild(this.searchElement);
        this.parentElement.appendChild(this.resetButton);
    }

    private executeSearch(event: Event): void {
        const searchValueElement = <HTMLInputElement>event.target;
        this.stateService.setCurrentSearch(searchValueElement.value);
    }

    private resetSearch(): void {
        this.stateService.setCurrentSearch('');
        this.stateService.setCurrentSearchPins(new SearchPins());
    }
}
import { StateService } from "../services/state.service";
import { filter } from "rxjs/operators";

export class PlayerComponent {
    audioElement: HTMLAudioElement;
    playButton: HTMLButtonElement;
    pauseButton: HTMLButtonElement;

    constructor(parentElement: HTMLElement, stateService: StateService) {
        console.log(`initializing player component ${parentElement}`);
        this.audioElement = document.createElement('audio');

        stateService.getCurrentAudioFile()
            .pipe(filter(value => value !== ''))
            .subscribe((file: string) => {
                this.audioElement.src = file;
                this.audioElement.load();
                this.audioElement.play();
            })

        this.playButton = document.createElement('button');
        this.playButton.innerText = 'play';
        this.playButton.onclick = (_event) => {
            this.playAudio();
        }

        this.pauseButton = document.createElement('button');
        this.pauseButton.innerText = 'pause';
        this.pauseButton.onclick = (_event) => {
            this.pauseAudio();
        }

        parentElement.appendChild(this.audioElement);
        parentElement.appendChild(this.playButton);
        parentElement.appendChild(this.pauseButton);
    }

    private pauseAudio(): void {
        this.audioElement.pause();
    }

    private playAudio(): void {
        this.audioElement.play();
    }
}
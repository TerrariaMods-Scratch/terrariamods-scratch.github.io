class VolumeControl {
    gainNode = null;
    unmuteVolume = 1;
    volumeBeforeFinishSetup = 1;
    callbacks = [];
    constructor(vm) {
        const audioEngine = vm.runtime.audioEngine;
        if (audioEngine) {
            this.gotAudioEngine(audioEngine);
        } else {
            vm.runtime.once("PROJECT_LOADED", () => {
                this.gotAudioEngine(vm.runtime.audioEngine);
            });
        }
    }
    setVolume(newVolume) {
        if (this.gainNode) {
            this.gainNode.value = newVolume;
        } else {
            this.volumeBeforeFinishSetup = newVolume;
        }
        this.callbacks.forEach((i) => i());
    }
    getVolume() {
        if (this.gainNode) {
            return this.gainNode.value;
        }
        return this.volumeBeforeFinishSetup;
    };
    isMuted() {
        return this.getVolume() === 0;
    };
    setUnmutedVolume (newUnmuteVolume) {
        this.unmuteVolume = newUnmuteVolume;
    };
    setMuted(newMuted) {
        if (newMuted) {
            this.setUnmutedVolume(this.getVolume());
            this.setVolume(0);
        } else {
            this.setVolume(this.unmuteVolume);
        }
    };
    onVolumeChanged(callback) {
        this.callbacks.push(callback);
    };
    gotAudioEngine(audioEngine) {
        this.gainNode = audioEngine.inputNode.gain;
        this.gainNode.value = this.volumeBeforeFinishSetup;
    }
}
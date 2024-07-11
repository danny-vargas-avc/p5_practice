// src/audioControl.js
export function setupAudioControl(audioSrc) {
  const audio = new Audio(audioSrc);

  const playAudio = () => {
    audio.currentTime = 0;
    audio.play();
    console.log('Audio playing');
  };

  const pauseAudio = () => {
    if (!audio.paused) {
      audio.pause();
      console.log('Audio paused');
    }
  };

  return { playAudio, pauseAudio };
}

export function checkAudio(
  bufferLength: number,
  dataArray: Float32Array<ArrayBuffer>,
  analyser: AnalyserNode
) {
  let isSpeaking = false;
  let lastSoundTime = Date.now();
  const THRESHOLD = 0.01;
  const SILENCE_DELAY = 500;

  analyser.getFloatTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  const rms = Math.sqrt(sum / bufferLength);

  if (rms > THRESHOLD) {
    if (!isSpeaking) {
      console.log('Voice started!');
      isSpeaking = true;
    }
    lastSoundTime = Date.now();
  } else {
    if (isSpeaking && Date.now() - lastSoundTime > SILENCE_DELAY) {
      console.log('Voice stopped (inactivity detected).');
      isSpeaking = false;
    }
  }

  return isSpeaking;
}

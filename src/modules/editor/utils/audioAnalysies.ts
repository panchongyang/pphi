//采样音乐可视化数据

/**
 *
 * @param audio
 * @param division 毫秒
 */
export async function audioAnalysies(
  audio: HTMLAudioElement,
  division: number
) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const offlineContext = new OfflineAudioContext(
    audioContext.destination.channelCount,
    audio.duration * audioContext.sampleRate,
    audioContext.sampleRate
  );

  const source = offlineContext.createBufferSource();
  const analyser = offlineContext.createAnalyser();
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  const res: number[] = [];

  // Fetch audio and decode it
  const response = await fetch(audio.src);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(offlineContext.destination);
  source.start();

  offlineContext.startRendering().then(() => {
    let curTime = 0;
    while (curTime < audio.duration * 1000) {
      analyser.getByteFrequencyData(frequencyData);
      console.log(frequencyData);
      res.push(frequencyData[0]);
      curTime += division;
    }
  });

  return res;
}

export async function audioAnalysies2(
  audio: HTMLAudioElement,
  division: number
) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Fetch audio and decode it
  const response = await fetch(audio.src);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Get PCM data
  const pcmData = audioBuffer.getChannelData(0);

  // Calculate the number of samples per division
  const samplesPerDivision = (audioBuffer.sampleRate * division) / 1000;

  // Create an array to store the results
  const res = [];

  // Loop over the PCM data in chunks of size samplesPerDivision
  for (let i = 0; i < pcmData.length; i += samplesPerDivision) {
    // Get the current chunk of data
    const chunk = pcmData.slice(i, i + samplesPerDivision);

    // Process the chunk of data...
    // Calculate the RMS value
    const rms = Math.sqrt(chunk.reduce((a, b) => a + b * b, 0) / chunk.length);

    // Add the result to the results array
    res.push(rms);
  }

  const maxVal = Math.max(...res);
  const minVal = Math.min(...res);

  let maxVariance = 0;
  let bestPower = 1;

  for (let power = 1; power <= 10; power += 0.1) {
    const transformed = res.map(
      (v) => Math.pow((v - minVal) / (maxVal - minVal), power) * 750
    );
    const mean = transformed.reduce((a, b) => a + b, 0) / transformed.length;
    const variance =
      transformed.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      transformed.length;

    if (variance > maxVariance) {
      maxVariance = variance;
      bestPower = power;
    }
  }

  return res.map(
    (v) => Math.pow((v - minVal) / (maxVal - minVal), bestPower) * 750
  );
}

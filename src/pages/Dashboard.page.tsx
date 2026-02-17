import { Mic, MicNone } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useWebsocket } from '@contexts/speech-socket/SpeechSocket.context';
import { MessageEnum } from '@app-types/socket';

const DashboardPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const [pongLength, setPongLength] = useState(0);

  // const [audioTempUrl, setAudioTempUrl] = useState<string | undefined>(undefined);

  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  // websocket
  const { socketState, lastJsonMessage, sendJsonMessage } = useWebsocket();

  useEffect(() => {
    if (lastJsonMessage) {
      console.log('last json message', lastJsonMessage);
      if (lastJsonMessage.type === MessageEnum.PONG) {
        setPongLength(prev => prev + 1);
        return;
      }

      setMessages(prev => [...prev, lastJsonMessage.data.text]);
    }
  }, [lastJsonMessage]);

  const startRecordVoice = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
        sampleRate: 24_000,
      },
    });

    audioContextRef.current = new AudioContext({ sampleRate: 24_000 });
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    const analyser = audioContextRef.current.createAnalyser();

    analyser.fftSize = 2048;
    // source.connect(analyser);

    // register
    await audioContextRef.current.audioWorklet.addModule('/audio-processor.js');
    workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'pcm-processor');

    workletNodeRef.current.port.onmessage = event => {
      const float32Data = event.data;

      const int16Data = new Int16Array(float32Data.length);
      for (let i = 0; i < float32Data.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Data[i]));
        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Convert to base64 (raw, no data URI prefix)
      const base64 = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));

      // Send to your backend
      sendJsonMessage({
        type: MessageEnum.SPEECH_TRANSLATION,
        data: { audioBase64: base64 },
      });
    };

    sourceRef.current.connect(analyser);
    sourceRef.current.connect(workletNodeRef.current);
    setIsRecording(true);

    // mediaRecorderRef.current = new MediaRecorder(stream);

    // mediaRecorderRef.current.ondataavailable = async event => {
    //   const isSpeaking = checkAudio(bufferLength, dataArray, analyser);

    //   if (event.data.size > 0) {
    //     voiceChunks.current.push(event.data);

    //     if (isSpeaking) {
    //       const fileReader = new FileReader();
    //       fileReader.readAsDataURL(event.data);
    //       fileReader.onloadend = () => {
    //         const base64DataUri = fileReader.result;
    //         if (!base64DataUri || typeof base64DataUri !== 'string') return;
    // sendJsonMessage({
    //   type: MessageEnum.SPEECH_TRANSLATION,
    //   data: { audioBase64: base64DataUri },
    // });
    //         // Result looks like: data:audio/webm;base64,GkXfo...
    //       };
    //     }
    //   }
    // };

    // mediaRecorderRef.current.onstart = event => {
    //   console.log('recording is starting now..', event);
    //   setIsRecording(true);
    //   setAudioTempUrl(undefined);
    //   voiceChunks.current = [];
    // };

    // mediaRecorderRef.current.onstop = event => {
    //   console.log('audio is stopping...', event);
    //   setIsRecording(false);
    //   const blob = new Blob(voiceChunks.current);
    //   const tempUrl = URL.createObjectURL(blob);
    //   setAudioTempUrl(tempUrl);
    // };

    // mediaRecorderRef.current.onerror = errorEvent => {
    //   console.log('while recording, there is an error here', errorEvent);
    // };

    // mediaRecorderRef.current.start(500);
  };

  const stopRecordVoice = () => {
    setIsRecording(false);
    workletNodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
  };

  const micIcon = isRecording ? <Mic /> : <MicNone />;
  const speakText = isRecording ? 'Speaking...' : 'Speak';
  const speakClick = isRecording ? stopRecordVoice : startRecordVoice;

  return (
    <div>
      <Typography variant="h2">Welcome to Speech Translation</Typography>

      <Card variant="outlined">
        <CardContent className="flex justify-center">
          <Typography variant="h6">
            While you are speaking, you can see what you are saying in the UI visually
          </Typography>
        </CardContent>
        <CardActions className="flex justify-center">
          <Button variant="contained" startIcon={micIcon} size="large" onClick={speakClick}>
            {speakText}
          </Button>
        </CardActions>

        <Typography>
          Socket Status: {'    '}
          {socketState}, There are PONGS ({pongLength})
        </Typography>

        <div className="mt-4 flex flex-col">
          <Typography variant="h5" fontWeight={600}>
            Message:
          </Typography>
          <div className="flex gap-2 flex-wrap">
            {messages.map((text, index) => {
              return <Typography key={text + index}>{text}</Typography>;
            })}
          </div>
        </div>

        {/* {audioTempUrl && (
          <div className="my-4 flex justify-center">
            <audio controls src={audioTempUrl} />
          </div>
        )} */}
      </Card>
    </div>
  );
};

export default DashboardPage;

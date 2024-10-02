import React, { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { CloseIcon } from "../../assets/cancel";
import "./SpeechToText.scss";
import spinner from "../../assets/spinner.svg";
import { MicrophoneIcon } from "../../assets/microphone_icon";
import { ReactMic } from "react-mic";

interface AppProps {
  updateResults: (results: string) => void;
  isplay: boolean;
  setIsplay: (value: boolean) => void;
  setBtnSubmit: (value: boolean) => void;
  setresetMessage: boolean;
  setIsRecording: (value: boolean) => void;
  isLoadingProcess: boolean;
}

const SpeechToText: React.FC<AppProps> = ({
  updateResults,
  setBtnSubmit,
  isplay,
  setIsplay,
  setresetMessage,
  setIsRecording,
  isLoadingProcess,
}) => {
  const {
    isRecording,
    results,
    error,
    startSpeechToText,
    setResults,
    stopSpeechToText,
  } = useSpeechToText({
    useLegacyResults: false,
    continuous: true,
    googleApiKey: "579522450676-m45rt335esul36btglc5g8t72141afgi.apps.googleusercontent.com",
    speechRecognitionProperties: {
      lang: "en-US",
    },
  });

  const [timer, setTimer] = useState({ minutes: "00", seconds: "00" });

  const isBrowserSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Timer for recording
  useEffect(() => {
    setIsRecording(isRecording);
    let interval: NodeJS.Timeout | undefined;

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          let nextSeconds = parseInt(prevTimer.seconds, 10) + 1;
          let nextMinutes = parseInt(prevTimer.minutes, 10);

          if (nextSeconds === 60) {
            nextMinutes += 1;
            nextSeconds = 0;
          }

          return {
            minutes: nextMinutes < 10 ? `0${nextMinutes}` : `${nextMinutes}`,
            seconds: nextSeconds < 10 ? `0${nextSeconds}` : `${nextSeconds}`,
          };
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording, setIsRecording]);

  useEffect(() => {
    // Check if results array exists and has data
    if (results && results.length > 0) {
      let latestTranscript = "";
  
      // Iterate over the results array
      for (let i = results.length - 1; i >= 0; i--) {
        const result = results[i];
  
        // Check if the result is of type ResultType (i.e., an object with a transcript property)
        if (typeof result !== "string" && result.transcript) {
          latestTranscript = result.transcript;
          break; // Exit the loop after finding the latest valid transcript
        }
      }
  
      // Check if the transcript exists and is not empty
      if (latestTranscript.trim() !== "") {
        updateResults(latestTranscript); // Send the transcript to updateResults
      }
    }
  }, [results, updateResults]);
  
  useEffect(() => {
    setResults([]);
  }, [setresetMessage, setResults]);

  // Handle speech recognition errors
  useEffect(() => {
    if (error) {
      console.error("Speech recognition error:", error);
      alert(`Speech recognition error: ${error}`);
    }
  }, [error]);

  // Stop recording and handle microphone click
  const handleMicClick = () => {
    stopSpeechToText();
    setIsplay(false);
  };

  if (!isBrowserSupported) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  return (
    <div className="speech-to-text-container">
      <div className="macrohone-wrap-main">
        <div onClick={isRecording ? stopSpeechToText : startSpeechToText}>
          <MicrophoneIcon color={isRecording ? "green" : "red"} />
        </div>
        <div onClick={handleMicClick}>
          <CloseIcon color="red" />
        </div>
        <div className="macrohone-wrap">
          <div className="macrohone-wrap-inner">
            {timer.minutes}:{timer.seconds}
          </div>
          <ReactMic
            record={isRecording}
            className="sound-wave"
            strokeColor="#000000"
            backgroundColor="#EFF2FD"
            mimeType="audio/wav"
            visualSetting="sinewave"
          />
          <button
            onClick={() => {
              setBtnSubmit(true);
              stopSpeechToText();
            }}
            className="btn"
          >
            {isLoadingProcess ? (
              <img src={spinner} alt="Loading" width={24} />
            ) : (
              "Process"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Type guard to ensure results are of type ResultType
function isResultType(result: string | ResultType): result is ResultType {
  return typeof result !== "string";
}

export default SpeechToText;

import { useState, useEffect, useRef } from 'react';

export function useVoiceSearch(onResult) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript && onResult) {
          onResult(transcript);
        }
      };
      recognitionRef.current = rec;
    }
  }, [onResult]);

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Voice recognition error:', err);
      }
    }
  };

  return { isListening, isSupported, toggleListening };
}

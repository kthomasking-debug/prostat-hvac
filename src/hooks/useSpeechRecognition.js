import { useEffect, useRef, useState, useCallback } from "react";

export function useSpeechRecognition({
  lang = "en-US",
  continuous = true,
  interim = true,
  autoRestart = true,
  onFinal,
  onInterim,
  onError,
  maxAutoRestarts = 12,
  autoStopOnFinal = false,
}) {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const manualStopRef = useRef(false);
  const restartCountRef = useRef(0);
  const lastProcessedResultIndexRef = useRef(0);
  
  // Store callbacks in refs to avoid re-creating recognition on callback changes
  const onFinalRef = useRef(onFinal);
  const onInterimRef = useRef(onInterim);
  const onErrorRef = useRef(onError);
  
  // Update refs when callbacks change
  useEffect(() => { onFinalRef.current = onFinal; }, [onFinal]);
  useEffect(() => { onInterimRef.current = onInterim; }, [onInterim]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  // Initialize speech recognition once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    
    setSupported(true);
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = continuous;
    rec.interimResults = interim;
    
    rec.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    rec.onend = () => {
      setIsListening(false);
      if (
        autoRestart &&
        !manualStopRef.current &&
        restartCountRef.current < maxAutoRestarts
      ) {
        restartCountRef.current += 1;
        // Brief delay to avoid rapid loop if permission denied
        setTimeout(() => {
          try {
            if (!manualStopRef.current) {
              rec.start();
            }
          } catch {
            // Ignore recognition start errors
          }
        }, 400);
      }
    };
    
    rec.onerror = (e) => {
      const code = e.error || "speech-error";
      setError(code);
      onErrorRef.current?.(code);
      setIsListening(false);
      
      // Don't auto-restart on "not-allowed" (permission denied) or "aborted"
      if (code === "not-allowed" || code === "aborted") {
        manualStopRef.current = true;
      }
    };
    
    rec.onresult = (e) => {
      let agg = "";
      let newFinalText = "";
      
      // Process all results for transcript display
      for (let i = 0; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        agg += chunk;
        if (!e.results[i].isFinal) {
          onInterimRef.current?.(chunk);
        }
      }
      const full = agg.trim();
      setTranscript(full);
      
      // Extract only NEW final results (those after what we've already processed)
      const lastProcessedIndex = lastProcessedResultIndexRef.current;
      for (let i = lastProcessedIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          newFinalText += e.results[i][0].transcript;
        }
      }
      
      const lastResult = e.results[e.results.length - 1];
      if (lastResult && lastResult.isFinal && newFinalText.trim()) {
        // Update the last processed index
        lastProcessedResultIndexRef.current = e.results.length;
        // Pass only the NEW final text, not the entire accumulated transcript
        onFinalRef.current?.(newFinalText.trim());
        if (autoStopOnFinal) {
          manualStopRef.current = true;
          try {
            rec.stop();
          } catch {
            // Ignore recognition stop errors
          }
        }
      }
    };
    
    recognitionRef.current = rec;
    
    return () => {
      manualStopRef.current = true;
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
    };
  }, [lang, continuous, interim, autoRestart, maxAutoRestarts, autoStopOnFinal]);

  const start = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec || !supported) return;
    
    // Reset state for new listening session
    manualStopRef.current = false;
    restartCountRef.current = 0;
    lastProcessedResultIndexRef.current = 0; // Reset result index tracking
    setError(null);
    setTranscript("");
    
    try {
      rec.start();
    } catch (e) {
      // Handle "already started" error gracefully
      if (e.name !== "InvalidStateError") {
        console.warn("Speech recognition start error:", e);
      }
    }
  }, [supported]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    
    manualStopRef.current = true;
    try {
      rec.stop();
    } catch {
      /* ignore */
    }
  }, []);

  return {
    supported,
    isListening,
    transcript,
    error,
    restartCount: restartCountRef.current,
    startListening: start,
    stopListening: stop,
  };
}

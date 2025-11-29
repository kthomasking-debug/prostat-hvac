import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Hook for wake word detection using Porcupine (Picovoice)
 *
 * ⚠️ DEMO MODE ONLY - BROWSER LIMITATIONS ⚠️
 *
 * This is a temporary browser-based implementation for demonstration purposes only.
 * It has critical limitations:
 * - Requires screen to be active (browser privacy restrictions)
 * - Limited to 3 devices on free Picovoice tier
 * - Cannot run in background when tablet screen is off
 *
 * PRODUCTION IMPLEMENTATION:
 * Wake word detection should run on the Raspberry Pi (Python) using openWakeWord.
 * The Pi will:
 * - Listen 24/7 (always on, no browser limitations)
 * - Use free, open-source openWakeWord (no licensing fees)
 * - Support custom "Hey Joule" wake word training
 * - Send WebSocket message to React frontend when wake word detected
 *
 * @param {Object} options
 * @param {Function} options.onWake - Callback when wake word is detected
 * @param {string} options.wakeWord - Wake word to detect (default: "hey joule")
 * @param {boolean} options.enabled - Whether wake word detection is enabled
 * @param {string} options.accessKey - Picovoice access key (optional, can use free tier)
 */
export function useWakeWord({
  onWake,
  // wakeWord parameter unused - Porcupine uses built-in "Hey Pico" wake word
  enabled = true,
  accessKey = null,
}) {
  const [isReady, setIsReady] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);

  const porcupineRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);
  const onWakeRef = useRef(onWake);

  // Update callback ref
  useEffect(() => {
    onWakeRef.current = onWake;
  }, [onWake]);

  // Initialize Porcupine
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      setSupported(false);
      return;
    }

    let mounted = true;

    const initPorcupine = async () => {
      try {
        // Check if Porcupine is available
        const { Porcupine } = await import("@picovoice/porcupine-web");

        // Try to get access key from localStorage or use provided one
        const key =
          accessKey || localStorage.getItem("picovoiceAccessKey") || null;

        if (!key) {
          console.warn(
            "[WakeWord] DEMO MODE: No Picovoice access key found. " +
              "This is a browser-based demo only. " +
              "For development/testing, get a free key at https://console.picovoice.ai/ " +
              "Then set it in localStorage: localStorage.setItem('picovoiceAccessKey', 'your-key') " +
              "NOTE: Production implementation will use Raspberry Pi with openWakeWord (free, no limits)"
          );
          setError("Picovoice access key required (Demo Mode Only)");
          setSupported(false);
          return;
        }

        // Initialize Porcupine with built-in wake words
        // Available wake words: "hey pico", "porcupine", "bumblebee", "picovoice", "terminator"
        // For "hey joule", we'll use "hey pico" as the closest match
        const porcupine = await Porcupine.create(
          key,
          [Porcupine.BuiltInKeyword.Pico] // Using built-in "hey pico" wake word
        );

        if (!mounted) {
          porcupine.release();
          return;
        }

        porcupineRef.current = porcupine;
        setSupported(true);
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error("[WakeWord] Initialization error:", err);
        if (mounted) {
          setError(err.message || "Failed to initialize wake word detection");
          setSupported(false);
        }
      }
    };

    initPorcupine();

    return () => {
      mounted = false;
      if (porcupineRef.current) {
        try {
          porcupineRef.current.release();
        } catch (e) {
          console.warn("[WakeWord] Error releasing Porcupine:", e);
        }
        porcupineRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.warn("[WakeWord] Error closing audio context:", e);
        }
        audioContextRef.current = null;
      }
    };
  }, [enabled, accessKey]);

  // Start/stop listening for wake word
  useEffect(() => {
    if (!isReady || !enabled || !porcupineRef.current) {
      setIsListening(false);
      return;
    }

    let mounted = true;
    let audioContext = null;

    const startListening = async () => {
      try {
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000, // Porcupine requires 16kHz
            echoCancellation: true,
            autoGainControl: true,
            noiseSuppression: true,
          },
        });

        // Create audio context with correct sample rate
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 16000,
        });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);

        // Use ScriptProcessorNode for audio processing (deprecated but widely supported)
        const frameLength = porcupineRef.current.frameLength;
        const processor = audioContext.createScriptProcessor(frameLength, 1, 1);

        processor.onaudioprocess = (e) => {
          if (!mounted || !porcupineRef.current) return;

          const inputBuffer = e.inputBuffer.getChannelData(0);

          // Convert Float32Array to Int16Array for Porcupine
          const int16Buffer = new Int16Array(inputBuffer.length);
          for (let i = 0; i < inputBuffer.length; i++) {
            const s = Math.max(-1, Math.min(1, inputBuffer[i]));
            int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }

          try {
            const keywordIndex = porcupineRef.current.process(int16Buffer);
            if (keywordIndex !== -1) {
              // Wake word detected!
              console.log("[WakeWord] Wake word detected!");
              onWakeRef.current?.();
            }
          } catch (err) {
            console.error("[WakeWord] Processing error:", err);
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
        audioWorkletNodeRef.current = processor;

        if (mounted) {
          setIsListening(true);
        }
      } catch (err) {
        console.error("[WakeWord] Error starting microphone:", err);
        if (mounted) {
          setError(err.message || "Failed to access microphone");
          setIsListening(false);
        }
      }
    };

    startListening();

    return () => {
      mounted = false;
      if (audioWorkletNodeRef.current) {
        try {
          audioWorkletNodeRef.current.disconnect();
        } catch {
          // Ignore disconnect errors
        }
        audioWorkletNodeRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {
          // Ignore close errors
        }
        audioContextRef.current = null;
      }
    };
  }, [isReady, enabled]);

  const stop = useCallback(() => {
    setIsListening(false);
    if (audioWorkletNodeRef.current) {
      try {
        audioWorkletNodeRef.current.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      audioWorkletNodeRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // Ignore close errors
      }
      audioContextRef.current = null;
    }
  }, []);

  return {
    supported,
    isReady,
    isListening,
    error,
    stop,
  };
}

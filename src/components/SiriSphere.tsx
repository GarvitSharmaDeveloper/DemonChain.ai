import React, { useState, useEffect, useRef } from 'react';
import { useCopilotChat } from "@copilotkit/react-core";
import { Mic, MicOff } from 'lucide-react';
import './SiriSphere.css';

interface SiriSphereProps {
    incidentContext: any;
}

type SphereState = 'idle' | 'listening' | 'speaking' | 'thinking';

const SiriSphere: React.FC<SiriSphereProps> = ({ incidentContext }) => {
    const [isActive, setIsActive] = useState(false);
    const [sphereState, setSphereState] = useState<SphereState>('idle');
    const [statusText, setStatusText] = useState('Voice Assistant Offline');

    // Web Speech API refs
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

    // Initialization string based on context
    const systemPrompt = `You are the ChainLink AI Crisis Commander. You are talking directly to stakeholders. 
    Current Incident: ${incidentContext.type} at ${incidentContext.location}. 
    Severity: ${incidentContext.severity}. 
    Keep responses very brief, conversational, and direct (max 2 sentences).`;

    const { appendMessage, visibleMessages, isLoading } = useCopilotChat({
        makeSystemMessage: () => systemPrompt,
    });

    // Handle Speech Output when AI finishes generating a new visible message
    useEffect(() => {
        if (!isLoading && visibleMessages.length > 0) {
            const lastMessage = visibleMessages[visibleMessages.length - 1];

            // Only speak if it's the assistant's message and we're actively in a session
            // We use a custom property or check if speech synthesis is currently active to avoid looping
            if ((lastMessage as any).role === 'assistant' && isActive && (lastMessage as any).content) {
                setSphereState('speaking');
                setStatusText('AI speaking...');

                // Cancel any previous speech
                synthRef.current.cancel();

                const utterance = new SpeechSynthesisUtterance((lastMessage as any).content as string);

                // You can also try to select a specific voice if desired based on OS
                const voices = synthRef.current.getVoices();
                const engVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Siri')) || voices[0];
                if (engVoice) utterance.voice = engVoice;

                utterance.pitch = 1.1;
                utterance.rate = 1.0;

                utterance.onend = () => {
                    // Back to listening immediately for fluid conversation flow
                    if (isActive) {
                        setSphereState('listening');
                        setStatusText('Listening...');
                        try {
                            recognitionRef.current?.start();
                        } catch (e) { }
                    } else {
                        setSphereState('idle');
                    }
                };

                synthRef.current.speak(utterance);
            }
        } else if (isLoading) {
            setSphereState('thinking');
            setStatusText('Assessing situation...');
        }
    }, [isLoading, visibleMessages, isActive]);

    // Handle Speech Input Initialization
    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // single utterance per toggle for demo
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = () => {
                setSphereState('listening');
                setStatusText('Listening...');
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setStatusText(`Heard: "${transcript}"`);
                setSphereState('idle'); // revert momentarily before loading

                // Send what was heard to Copilot
                appendMessage(transcript);

                // Also stop the recognition engine since it's now AI's turn to think
                recognitionRef.current.stop();
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setStatusText(`Error: ${event.error}`);
                setSphereState('idle');
                setIsActive(false);
            };

            recognitionRef.current.onend = () => {
                // If it ended naturally but we are still in "active" mode, we're likely waiting for AI
                if (sphereState === 'listening') {
                    setSphereState('idle');
                }
            };
        } else {
            setStatusText('Speech Recognition not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
            synthRef.current.cancel();
        };
    }, []);

    const toggleSession = () => {
        if (isActive) {
            setIsActive(false);
            setSphereState('idle');
            setStatusText('Voice Assistant Offline');
            recognitionRef.current?.abort();
            synthRef.current?.cancel();
        } else {
            setIsActive(true);
            setSphereState('listening');
            setStatusText('Starting engine...');
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Already started", e);
            }
        }
    };

    return (
        <div className="siri-sphere-container">
            <div className={`siri-sphere ${sphereState}`}></div>

            <div className="status-text">{statusText}</div>

            <button
                className={`sphere-toggle-btn ${isActive ? 'active' : ''}`}
                onClick={toggleSession}
            >
                {isActive ? <MicOff size={16} /> : <Mic size={16} />}
                {isActive ? 'End Session' : 'Start AI Voice'}
            </button>
        </div>
    );
};

export default SiriSphere;

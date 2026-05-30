
import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { VirtualPartnerChatMessage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { getVirtualPartnerWelcome } from '../services/geminiService'; // Import new service

// --- Audio Helper Functions (Gemini Live API Standards) ---

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to -1 to 1 before converting
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: uint8ArrayToBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const VirtualPartnerChatPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const {
    currentUser,
    virtualPartner,
    virtualPartnerChatHistory,
    sendVirtualPartnerMessage,
    errorVirtualPartner,
    isDarkMode, 
    updateVirtualPartner
  } = context;

  const [inputText, setInputText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // --- Voice Call State ---
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnectingCall, setIsConnectingCall] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'listening' | 'speaking'>('connecting');
  
  // Refs for Audio Handling
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null); // To store the active session

  // Redirect if no user or virtual partner is logged in/created
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!virtualPartner) {
      navigate('/virtual-partner/create');
    }
  }, [currentUser, virtualPartner, navigate]);

  // Automatic Welcome Message
  useEffect(() => {
      const initChat = async () => {
          if (virtualPartner && currentUser && virtualPartnerChatHistory.length === 0 && !isInitializing) {
              setIsInitializing(true);
              const welcomeText = await getVirtualPartnerWelcome(virtualPartner, currentUser.name.split(' ')[0]);
              
              // We need to manually inject this into the history in context without triggering a full AI response yet
              // Assuming AppContext allows modifying history, or we simulate a received message.
              // Since App.tsx manages history via sendVirtualPartnerMessage which calls AI, we might need a direct way to add a system message.
              // For now, we will simulate the Partner typing it out.
              
              // NOTE: In a real app, we'd have a 'receiveMessage' function in context. 
              // Since we don't, we will use a workaround or assuming the backend/service handles persistence.
              // Here, we'll mimic it by creating a dummy message object and updating state if possible, 
              // BUT `virtualPartnerChatHistory` is read-only from context perspective usually unless there's a setter.
              // The `sendVirtualPartnerMessage` function in App.tsx adds user message then bot message.
              // We will leverage `sendVirtualPartnerMessage` with a special prompt if history is empty, 
              // OR better, we just render it if history is empty, but that's UI only.
              
              // For this demo, let's just use the `updateVirtualPartner` to trigger a re-render if needed, 
              // but mostly we want to persist this. Since `sendVirtualPartnerMessage` is user-driven,
              // we will just display a "Greeting" bubble locally or trigger a hidden user prompt like "Say hello".
              
              // Triggering AI to say hello via hidden prompt:
              await sendVirtualPartnerMessage("Say a warm, realistic welcome message to me based on your persona.");
              setIsInitializing(false);
          }
      };
      
      initChat();
  }, [virtualPartner, currentUser, virtualPartnerChatHistory.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [virtualPartnerChatHistory, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endVoiceCall();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const sendMessage = async (text: string) => {
      if (text.trim() && sendVirtualPartnerMessage && !isSendingMessage) {
        setIsSendingMessage(true);
        try {
          await sendVirtualPartnerMessage(text);
        } catch (error) {
          // Error handled by App.tsx
        } finally {
          setIsSendingMessage(false);
        }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = inputText;
    setInputText('');
    sendMessage(msg);
  };

  const handleQuickAction = (action: string) => {
      let prompt = "";
      switch(action) {
          case 'game':
              prompt = "I want to play a game! Suggest something fun like 20 Questions, Trivia, or a Roleplay scenario.";
              break;
          case 'hobbies':
              prompt = "Let's talk about our hobbies. What are you into lately? Here's what I like...";
              break;
          case 'health':
              prompt = "Can we do a quick health and wellness check-in? Ask me about my sleep, water, and mood.";
              break;
          case 'advice':
              prompt = "I need some advice regarding a family or personal problem. Can you listen and help me think it through?";
              break;
      }
      if(prompt) sendMessage(prompt);
  };

  const getProgressBarColor = (value: number) => {
    if (value > 75) return `bg-primary-teal ${isDarkMode ? 'dark:bg-primary-teal-dark' : ''}`;
    if (value > 40) return `bg-secondary-mint ${isDarkMode ? 'dark:bg-secondary-mint-dark' : ''}`;
    if (value > 20) return `bg-orange-400 ${isDarkMode ? 'dark:bg-orange-500' : ''}`;
    return `bg-red-500 ${isDarkMode ? 'dark:bg-red-600' : ''}`;
  }

  // --- Voice Call Logic ---

  const startVoiceCall = async () => {
    if (!virtualPartner) return;
    setIsCallActive(true);
    setIsConnectingCall(true);
    setCallStatus('connecting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      // Input: 16kHz required by Gemini
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      // Output: 24kHz required by Gemini
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // Request Mic Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Configure System Instruction based on Partner Persona
      const systemInstruction = `
        You are ${virtualPartner.name}. 
        Role: ${virtualPartner.relationshipType || 'Wellness Partner'}.
        Personality Traits: ${virtualPartner.personalityTraits.join(', ')}.
        Communication Style: ${virtualPartner.communicationStyle || 'Supportive and Kind'}.
        Bio: ${virtualPartner.bio}.
        Current Scenario: ${virtualPartner.currentScenario || 'None'}.
        
        Act as a voice companion. Keep responses relatively concise and conversational, suitable for spoken dialogue. 
        Be warm, engaging, and react to the user's emotions.
      `;

      // Establish Connection
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // 'Kore' is generally a warm voice
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            console.log('Voice session connected');
            setCallStatus('listening');
            setIsConnectingCall(false);

            // Setup Input Streaming
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setCallStatus('speaking'); // Visual indicator
              
              const ctx = outputAudioContextRef.current;
              if (ctx) {
                // Ensure timing
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  ctx,
                  24000,
                  1
                );

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                source.addEventListener('ended', () => {
                   scheduledSourcesRef.current.delete(source);
                   if (scheduledSourcesRef.current.size === 0) {
                       setCallStatus('listening'); // Back to listening when done speaking
                   }
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                scheduledSourcesRef.current.add(source);
              }
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
                console.log("Model interrupted");
                scheduledSourcesRef.current.forEach(src => {
                    src.stop();
                });
                scheduledSourcesRef.current.clear();
                if (outputAudioContextRef.current) {
                    nextStartTimeRef.current = outputAudioContextRef.current.currentTime;
                }
                setCallStatus('listening');
            }
          },
          onclose: () => {
            console.log('Voice session closed');
            endVoiceCall();
          },
          onerror: (err) => {
            console.error('Voice session error:', err);
            endVoiceCall();
          }
        }
      });

      // Store session to ensure we can close it if needed, 
      // though the library handles cleanup mostly via onclose/callbacks.
      sessionPromise.then(session => {
          sessionRef.current = session;
      });

    } catch (err) {
      console.error("Failed to start voice call", err);
      setIsCallActive(false);
      setIsConnectingCall(false);
      alert("Could not start voice call. Please check microphone permissions.");
    }
  };

  const endVoiceCall = () => {
    // 1. Stop Media Stream
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    // 2. Close Audio Contexts
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    // 3. Clear Refs
    scheduledSourcesRef.current.clear();
    // 4. Close Session
    if (sessionRef.current) {
        sessionRef.current = null;
    }

    setIsCallActive(false);
    setCallStatus('connecting');
  };

  if (!currentUser || !virtualPartner) {
    return null;
  }

  // Check if the last message is a typing indicator (for text chat)
  const isTyping = virtualPartnerChatHistory.length > 0 && virtualPartnerChatHistory[virtualPartnerChatHistory.length - 1].text === '...' && virtualPartnerChatHistory[virtualPartnerChatHistory.length - 1].isVirtualPartner;
  
  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto relative">
      
      {/* Voice Call Overlay */}
      {isCallActive && (
        <div className="absolute inset-0 z-50 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-8 animate-fade-in text-white">
            {/* Header */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Live Voice</span>
                </div>
                <button onClick={endVoiceCall} className="text-gray-400 hover:text-white transition-colors">
                    <i className="fas fa-compress-alt text-xl"></i>
                </button>
            </div>

            {/* Avatar / Visualizer */}
            <div className="relative mb-12">
                {/* Ripple Effect when speaking */}
                {callStatus === 'speaking' && (
                    <>
                        <div className="absolute inset-0 rounded-full border-2 border-brand-teal/50 animate-ping-slow"></div>
                        <div className="absolute inset-[-20px] rounded-full border border-brand-teal/30 animate-ping-slower"></div>
                    </>
                )}
                {/* Listening Glow */}
                {callStatus === 'listening' && (
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                )}

                <img 
                    src={virtualPartner.avatar} 
                    alt={virtualPartner.name} 
                    className="w-48 h-48 rounded-full object-cover border-4 border-white/10 shadow-2xl relative z-10" 
                />
                
                {isConnectingCall && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-20 backdrop-blur-sm">
                        <LoadingSpinner />
                    </div>
                )}
            </div>

            {/* Status Text */}
            <h2 className="text-3xl font-bold mb-2">{virtualPartner.name}</h2>
            <p className="text-gray-400 font-medium text-lg mb-12 animate-pulse">
                {isConnectingCall ? 'Connecting...' : 
                 callStatus === 'speaking' ? 'Speaking...' : 
                 callStatus === 'listening' ? 'Listening...' : 'Connected'}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-8">
                <button className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
                    <i className="fas fa-microphone-slash text-xl"></i>
                </button>
                <button 
                    onClick={endVoiceCall}
                    className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 flex items-center justify-center transition-all transform hover:scale-105"
                >
                    <i className="fas fa-phone-slash text-3xl"></i>
                </button>
                <button className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all">
                    <i className="fas fa-volume-up text-xl"></i>
                </button>
            </div>
        </div>
      )}

      {/* Standard Header */}
      <div className="p-4 bg-primary-teal dark:bg-primary-teal-dark text-white text-xl font-semibold flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
            <button onClick={() => navigate('/virtual-partner/create')} className="mr-3 text-white hover:text-secondary-mint dark:hover:text-secondary-mint-dark flex-shrink-0" aria-label="Back to Virtual Partner Profile">
            <i className="fas fa-arrow-left"></i>
            </button>
            <img src={virtualPartner.avatar} alt={virtualPartner.name} className="w-9 h-9 rounded-full mr-3 object-cover border border-white dark:border-dark-mode-card-bg flex-shrink-0" />
            <div className="flex flex-col overflow-hidden">
                <span className="truncate text-base">{virtualPartner.name}</span>
                <span className="text-xs opacity-80 font-normal">Virtual Partner</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Voice Call Button */}
             <button 
                onClick={startVoiceCall}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-md"
                title="Start Voice Call"
             >
                 <i className="fas fa-phone-alt"></i>
             </button>

            {/* Relationship Meter */}
            <div className="hidden md:flex items-center text-sm">
                <div className="w-16 bg-black/20 rounded-full h-1.5 mr-2">
                    <div
                    className="bg-white h-1.5 rounded-full"
                    style={{ width: `${virtualPartner.relationshipMeter}%` }}
                    ></div>
                </div>
                <span className="text-xs font-bold">{virtualPartner.relationshipMeter}%</span>
            </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gray-50 dark:bg-dark-mode-input-bg border-b border-gray-100 dark:border-gray-700 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => handleQuickAction('game')} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 transition-colors flex items-center gap-1">
              <i className="fas fa-gamepad"></i> Play Game
          </button>
          <button onClick={() => handleQuickAction('hobbies')} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 transition-colors flex items-center gap-1">
              <i className="fas fa-puzzle-piece"></i> Hobbies
          </button>
          <button onClick={() => handleQuickAction('health')} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 transition-colors flex items-center gap-1">
              <i className="fas fa-heartbeat"></i> Wellness Check
          </button>
          <button onClick={() => handleQuickAction('advice')} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 transition-colors flex items-center gap-1">
              <i className="fas fa-comments"></i> Family & Advice
          </button>
      </div>

      <div className="flex flex-col-reverse md:flex-row-reverse flex-grow overflow-hidden">
        {/* Right Sidebar for Gameplay Metrics (Hidden on mobile) */}
        <div className="hidden md:block w-1/3 bg-light-background dark:bg-dark-mode-input-bg p-4 overflow-y-auto border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-dark-text dark:text-dark-mode-text mb-3">Dynamics</h3>

          {/* Current Scenario */}
          <div className="bg-white dark:bg-dark-mode-card-bg p-3 rounded-lg shadow-sm mb-4">
            <p className="font-semibold text-dark-text dark:text-dark-mode-text text-sm mb-1">Current Scenario:</p>
            <p className="text-text-base dark:text-dark-mode-text-base text-xs italic">{virtualPartner.currentScenario || "No active scenario."}</p>
          </div>

          {/* Emotional State */}
          <div className="mb-4">
            <p className="font-semibold text-dark-text dark:text-dark-mode-text text-sm mb-2">Emotional State:</p>
            <div className="space-y-2">
              {['happiness', 'motivation', 'trust'].map((emotionKey) => {
                const value = virtualPartner.emotionalState[emotionKey as keyof typeof virtualPartner.emotionalState];
                return (
                  <div key={emotionKey}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs capitalize text-text-base dark:text-dark-mode-text-base">{emotionKey}:</span>
                      <span className="text-xs font-semibold">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`${getProgressBarColor(value)} h-1.5 rounded-full`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Relationship Goals */}
          <div>
            <p className="font-semibold text-dark-text dark:text-dark-mode-text text-sm mb-2">Relationship Goals:</p>
            <ul className="text-text-base dark:text-dark-mode-text-base text-xs space-y-1">
              {virtualPartner.relationshipGoals.map((goal, index) => (
                <li key={index} className="flex items-center">
                  {goal.complete ? (
                    <i className="fas fa-check-circle text-primary-teal dark:text-primary-teal-dark mr-2"></i>
                  ) : (
                    <i className="far fa-circle text-gray-400 dark:text-gray-500 mr-2"></i>
                  )}
                  <span className={goal.complete ? 'line-through text-gray-500 dark:text-dark-mode-text-base' : ''}>{goal.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Chat Window */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {virtualPartnerChatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               {isInitializing ? <LoadingSpinner /> : <p>Start a conversation with {virtualPartner.name}!</p>}
            </div>
          ) : (
            virtualPartnerChatHistory.map((message) => {
                // Filter out the "system" prompt we used to trigger the welcome message if it exists in history but we don't want to show it
                if (!message.isVirtualPartner && message.text.includes("Say a warm, realistic welcome message")) return null;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.isVirtualPartner ? 'justify-start' : 'justify-end'}`}
                  >
                    {message.isVirtualPartner && (
                      <img
                        src={virtualPartner.avatar}
                        alt={virtualPartner.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover self-end"
                      />
                    )}
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-sm ${
                        message.isVirtualPartner
                          ? 'bg-light-background dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text rounded-bl-none'
                          : 'bg-accent-sky dark:bg-accent-sky-dark text-white rounded-br-none'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">
                        {message.isVirtualPartner ? virtualPartner.name : currentUser.name}
                      </p>
                      <p>{message.text}</p>
                      <span className="block text-xs text-right opacity-75 mt-1">
                        {message.text !== '...' ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {!message.isVirtualPartner && (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full ml-3 object-cover self-end"
                      />
                    )}
                  </div>
                );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {errorVirtualPartner && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mx-4 mb-2" role="alert">
          <strong className="font-bold">Chat Error:</strong>
          <span className="block sm:inline ml-2">{errorVirtualPartner}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-dark-mode-input-bg border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Message ${virtualPartner.name}...`}
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal dark:focus:ring-primary-teal-dark bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
          disabled={isSendingMessage || isTyping}
          aria-label={`Message ${virtualPartner.name}`}
        />
        <button
          type="submit"
          className="ml-4 bg-primary-teal dark:bg-primary-teal-dark text-white px-6 py-3 rounded-lg shadow hover:bg-secondary-mint dark:hover:bg-secondary-mint-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputText.trim() || isSendingMessage || isTyping}
        >
          {isSendingMessage ? <LoadingSpinner /> : 'Send'}
        </button>
      </form>
    </div>
  );
};

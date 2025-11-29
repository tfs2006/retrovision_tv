import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Screen } from './components/Screen';
import { Remote } from './components/Remote';
import { CHANNELS, getChannelById } from './services/channels';
import { Channel, TVState } from './types';

function App() {
  const [powerOn, setPowerOn] = useState(false);
  const [channelIndex, setChannelIndex] = useState(0);
  const [tvState, setTvState] = useState<TVState>(TVState.OFF);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio for static noise
  const staticAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Static Audio
  useEffect(() => {
    staticAudioRef.current = new Audio('https://upload.wikimedia.org/wikipedia/commons/e/e0/Television_static.ogg');
    staticAudioRef.current.loop = true;
    staticAudioRef.current.volume = 0.1;
  }, []);

  // Handle TV State Logic
  const handlePower = useCallback(() => {
    if (powerOn) {
      setPowerOn(false);
      setTvState(TVState.OFF);
      staticAudioRef.current?.pause();
    } else {
      setPowerOn(true);
      setTvState(TVState.STATIC);
      staticAudioRef.current?.play().catch(() => {});
      
      // Warm up delay
      setTimeout(() => {
        setTvState(TVState.TUNING);
        // Tuning delay
        setTimeout(() => {
          setTvState(TVState.PLAYING);
          staticAudioRef.current?.pause();
        }, 1500);
      }, 1000);
    }
  }, [powerOn]);

  const changeChannel = useCallback((newIndex: number) => {
    if (!powerOn) return;
    
    // Validate index loop
    let validIndex = newIndex;
    if (validIndex < 0) validIndex = CHANNELS.length - 1;
    if (validIndex >= CHANNELS.length) validIndex = 0;

    // Transition effect
    setTvState(TVState.STATIC);
    staticAudioRef.current?.play().catch(() => {});
    
    setTimeout(() => {
      setChannelIndex(validIndex);
      setTimeout(() => {
        setTvState(TVState.PLAYING);
        staticAudioRef.current?.pause();
      }, 600);
    }, 400);
  }, [powerOn]);

  const handleChannelUp = () => changeChannel(channelIndex + 1);
  const handleChannelDown = () => changeChannel(channelIndex - 1);
  
  const handleNumber = (num: number) => {
    if (!powerOn) return;
    // Map 1-9 to index 0-8. 0 maps to index 9 if exists, or last.
    // For simplicity, let's just find channel with ID = num.
    const foundIndex = CHANNELS.findIndex(c => c.id === num);
    if (foundIndex !== -1) {
      changeChannel(foundIndex);
    }
  };

  const handleVolumeUp = () => setVolume(v => Math.min(v + 10, 100));
  const handleVolumeDown = () => setVolume(v => Math.max(v - 10, 0));
  const handleMute = () => setIsMuted(m => !m);

  const currentChannel = CHANNELS[channelIndex];

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col md:flex-row items-center justify-center p-4 gap-12 font-sans overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#333_0%,_#000_100%)]"></div>

      {/* TV Set Container */}
      <div className="relative w-full max-w-4xl aspect-[4/3] bg-[#2a2a2a] rounded-[3rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_10px_20px_rgba(255,255,255,0.1),inset_0_-10px_30px_rgba(0,0,0,0.5)] border-t border-white/10">
        
        {/* Wood grain side panels optional, keeping it sleek plastic 90s style */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-[#222] rounded-l-[3rem] border-r border-black/50"></div>
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-[#222] rounded-r-[3rem] border-l border-black/50"></div>

        {/* Branding */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-[#111] px-3 py-1 rounded border border-white/10 shadow-inner">
                 <span className="font-[VT323] text-xl text-neutral-400 tracking-[0.3em] font-bold">SONYO</span>
            </div>
        </div>

        {/* LED Indicator */}
        <div className="absolute bottom-8 right-20 z-40 flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Power</span>
            <div className={`w-2 h-2 rounded-full ${powerOn ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-900'}`}></div>
        </div>
        
        {/* Screen Area */}
        <div className="relative w-full h-full bg-black rounded-[4rem] overflow-hidden shadow-[inset_0_0_20px_black] z-10">
           <Screen 
             channel={currentChannel}
             tvState={tvState}
             volume={volume}
             isMuted={isMuted}
           />
        </div>

        {/* Feet */}
        <div className="absolute -bottom-4 left-20 w-16 h-8 bg-[#1a1a1a] rounded-b-lg"></div>
        <div className="absolute -bottom-4 right-20 w-16 h-8 bg-[#1a1a1a] rounded-b-lg"></div>
      </div>

      {/* Remote Control - Positioned on side for desktop, below for mobile */}
      <div className="relative z-50 transform md:rotate-1 md:translate-y-12">
        <Remote 
          onPower={handlePower}
          onChannelUp={handleChannelUp}
          onChannelDown={handleChannelDown}
          onVolumeUp={handleVolumeUp}
          onVolumeDown={handleVolumeDown}
          onMute={handleMute}
          onNumber={handleNumber}
          isPowerOn={powerOn}
        />
        
        {/* Guide Hint */}
        <div className="mt-8 text-neutral-500 text-xs text-center max-w-[250px]">
          <p className="mb-2">CHANNEL LIST</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left font-mono">
            {CHANNELS.map(c => (
              <div key={c.id} className="flex justify-between">
                <span>{c.id}.</span>
                <span className="truncate w-20">{c.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 italic text-neutral-600">
            "Gemini AI generates live program info..."
          </p>
        </div>
      </div>

    </div>
  );
}

export default App;

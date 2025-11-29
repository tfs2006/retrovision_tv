import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Channel, ProgramInfo, TVState } from '../types';
import { generateProgramGuide } from '../services/geminiService';

interface ScreenProps {
  channel: Channel;
  tvState: TVState;
  volume: number;
  isMuted: boolean;
}

export const Screen: React.FC<ScreenProps> = ({ channel, tvState, volume, isMuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [programInfo, setProgramInfo] = useState<ProgramInfo | null>(null);
  const [showOSD, setShowOSD] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  // Playback Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (tvState === TVState.OFF) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
      return;
    }

    if (tvState === TVState.PLAYING) {
      setError(false);
      // Initialize HLS
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.warn("Autoplay blocked", e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
             console.error("HLS Fatal Error", data);
             setError(true);
             hls.destroy();
          }
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        video.src = channel.url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.warn("Autoplay blocked", e));
        });
        video.addEventListener('error', () => setError(true));
      } else {
        setError(true);
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.url, tvState]);

  // Volume Logic
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // AI Guide Logic
  useEffect(() => {
    if (tvState === TVState.PLAYING) {
      // Clear previous info immediately
      setProgramInfo(null);
      setShowOSD(true);
      
      const fetchGuide = async () => {
        const info = await generateProgramGuide(channel.name, channel.category);
        setProgramInfo({
          ...info,
          startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      };
      
      fetchGuide();

      // Hide OSD after 8 seconds
      const timer = setTimeout(() => setShowOSD(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [channel, tvState]);

  // Visual Rendering
  const isStatic = tvState === TVState.STATIC || tvState === TVState.TUNING || error;
  const isOff = tvState === TVState.OFF;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-[4rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] border-4 border-[#222]">
      
      {/* Video Layer */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isStatic || isOff ? 'opacity-0' : 'opacity-100'}`}
        style={{ filter: 'contrast(1.2) saturate(1.2) sepia(0.1)' }}
      />

      {/* Static Noise Layer */}
      {isStatic && !isOff && (
        <div className="absolute inset-0 w-full h-full bg-neutral-800 opacity-90 flex items-center justify-center overflow-hidden">
             {/* Simple CSS noise effect using repeat-conic-gradient or similar if image fails, but we use a specialized grainy div */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-60 brightness-150 animate-[noise_0.2s_infinite]"></div>
             <div className="z-10 text-white font-[VT323] text-2xl tracking-widest opacity-80 animate-pulse">
                {error ? "NO SIGNAL" : "TUNING..."}
             </div>
        </div>
      )}

      {/* Turn Off Animation Overlay */}
      <div className={`absolute inset-0 bg-black pointer-events-none z-50 ${isOff ? 'animate-turn-off' : 'hidden'}`}></div>
      
      {/* Turn On Animation Overlay - simulated by keeping the container masked initially if we wanted, 
          but here we just let the content fade in/scale. For the white dot effect, we can use a pseudo element.
       */}

      {/* CRT Overlay Effects */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]"></div>
        {/* Screen Curvature Reflection */}
        <div className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-white/10 to-transparent rounded-t-[4rem]"></div>
      </div>

      {/* On Screen Display (OSD) */}
      {!isOff && showOSD && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] z-30 pointer-events-none">
          <div className="bg-green-900/80 border-2 border-green-500/50 text-green-100 p-4 font-[VT323] shadow-[0_0_15px_rgba(0,255,0,0.3)] backdrop-blur-sm transform transition-all duration-500">
            <div className="flex justify-between items-end border-b border-green-500/30 pb-1 mb-2">
              <span className="text-3xl text-green-400 drop-shadow-md">CH {channel.id.toString().padStart(2, '0')}</span>
              <span className="text-xl opacity-80">{channel.name}</span>
            </div>
            
            {programInfo ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-500 text-black px-1 text-sm font-bold">NOW</span>
                    <h3 className="text-2xl uppercase tracking-wide">{programInfo.title}</h3>
                </div>
                <p className="text-lg leading-tight opacity-90 text-green-200/90">{programInfo.synopsis}</p>
              </div>
            ) : (
              <div className="text-lg animate-pulse">DOWNLOADING PROGRAM DATA...</div>
            )}
            
            <div className="mt-2 text-right text-sm opacity-60">STEREO • {volume}% VOL</div>
          </div>
        </div>
      )}

      {/* Volume/Mute Indicator (Transient) */}
      {!isOff && (
        <div className={`absolute top-8 right-8 z-30 transition-opacity duration-300 ${volume > 0 && !isMuted ? 'opacity-0' : 'opacity-100'}`}>
          {isMuted && <span className="text-green-500 font-[VT323] text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">MUTE</span>}
        </div>
      )}

    </div>
  );
};

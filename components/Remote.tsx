import React from 'react';
import { Power, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';

interface RemoteProps {
  onPower: () => void;
  onChannelUp: () => void;
  onChannelDown: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onNumber: (num: number) => void;
  isPowerOn: boolean;
}

export const Remote: React.FC<RemoteProps> = ({ 
  onPower, onChannelUp, onChannelDown, onVolumeUp, onVolumeDown, onMute, onNumber, isPowerOn 
}) => {
  const btnClass = "w-12 h-12 rounded bg-neutral-700 shadow-[0_3px_0_#404040] active:translate-y-[3px] active:shadow-none text-white flex items-center justify-center hover:bg-neutral-600 transition-all active:bg-neutral-800";

  return (
    <div className="bg-neutral-800 rounded-b-3xl rounded-t-lg p-6 w-64 shadow-[10px_10px_30px_rgba(0,0,0,0.5),inset_2px_2px_5px_rgba(255,255,255,0.1)] border-r-4 border-b-4 border-neutral-950 flex flex-col gap-6 relative select-none">
      {/* Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none rounded-3xl"></div>

      {/* Power Section */}
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col items-center gap-1">
             <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isPowerOn ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-900'}`}></div>
             <span className="text-[10px] text-neutral-400 font-bold tracking-wider">PWR</span>
        </div>
        <button 
          onClick={onPower}
          className="w-14 h-14 rounded-full bg-red-600 shadow-[0_4px_0_#7f1d1d,0_5px_10px_rgba(0,0,0,0.5)] active:shadow-[0_0_0_#7f1d1d,inset_0_2px_5px_rgba(0,0,0,0.5)] active:translate-y-1 transition-all flex items-center justify-center text-white hover:bg-red-500"
        >
          <Power size={24} />
        </button>
      </div>

      {/* Nav Section */}
      <div className="bg-neutral-900/50 rounded-2xl p-4 flex flex-col gap-4 border border-white/5">
        <div className="flex justify-between items-center gap-4">
             {/* Volume */}
             <div className="flex flex-col items-center gap-2">
                <button onClick={onVolumeUp} className={btnClass}>+</button>
                <span className="text-xs text-neutral-400 font-bold">VOL</span>
                <button onClick={onVolumeDown} className={btnClass}>-</button>
             </div>
             
             {/* Channel */}
             <div className="flex flex-col items-center gap-2">
                <button onClick={onChannelUp} className={btnClass}><ChevronUp size={16}/></button>
                <span className="text-xs text-neutral-400 font-bold">CH</span>
                <button onClick={onChannelDown} className={btnClass}><ChevronDown size={16}/></button>
             </div>
        </div>
        
        <div className="flex justify-center">
            <button 
                onClick={onMute} 
                className="w-full py-2 rounded-lg bg-neutral-700 shadow-[0_3px_0_#404040] active:translate-y-[3px] active:shadow-none text-neutral-300 flex justify-center items-center hover:bg-neutral-600"
            >
                <VolumeX size={16} />
            </button>
        </div>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 px-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button 
            key={num}
            onClick={() => onNumber(num)}
            className="w-full aspect-square rounded bg-neutral-700 shadow-[0_3px_0_#404040] active:translate-y-[3px] active:shadow-none text-white font-bold font-mono text-lg hover:bg-neutral-600 transition-colors"
          >
            {num}
          </button>
        ))}
        <div className="col-start-2">
          <button 
            onClick={() => onNumber(0)}
            className="w-full aspect-square rounded bg-neutral-700 shadow-[0_3px_0_#404040] active:translate-y-[3px] active:shadow-none text-white font-bold font-mono text-lg hover:bg-neutral-600 transition-colors"
          >
            0
          </button>
        </div>
      </div>

      {/* Brand */}
      <div className="text-center mt-2">
        <span className="font-[VT323] text-2xl text-neutral-500 tracking-[0.2em] uppercase">Sonyo</span>
      </div>
    </div>
  );
};
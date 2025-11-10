'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OCRContextType {
  cooldownUntil: number | null;
  setCooldown: (until: number) => void;
  clearCooldown: () => void;
  isOnCooldown: boolean;
  remainingTime: string;
}

const OCRContext = createContext<OCRContextType | undefined>(undefined);

export const OCRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [nowTs, setNowTs] = useState<number>(Date.now());
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const stored = sessionStorage.getItem('ocr_cooldown_until');
    if (stored) {
      const until = parseInt(stored, 10);
      if (until > Date.now()) {
        setCooldownUntil(until);
      } else {
        sessionStorage.removeItem('ocr_cooldown_until');
      }
    }
  }, []);

  useEffect(() => {
    if (cooldownUntil) {
      sessionStorage.setItem('ocr_cooldown_until', cooldownUntil.toString());
    } else {
      sessionStorage.removeItem('ocr_cooldown_until');
    }
  }, [cooldownUntil]);

  useEffect(() => {
    if (!cooldownUntil) {
      setRemainingTime('');
      return;
    }
    const updateTime = () => {
      const ts = Date.now();
      setNowTs(ts);
      const remainingMs = cooldownUntil - ts;
      if (remainingMs <= 0) {
        setCooldownUntil(null);
        setRemainingTime('');
        sessionStorage.removeItem('ocr_cooldown_until');
        return;
      }
      const totalSec = Math.floor(remainingMs / 1000);
      const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const s = String(totalSec % 60).padStart(2, '0');
      setRemainingTime(`${m}:${s}`);
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const setCooldown = (until: number) => {
    setCooldownUntil(until);
  };

  const clearCooldown = () => {
    setCooldownUntil(null);
  };

  const isOnCooldown = cooldownUntil ? nowTs < cooldownUntil : false;

  return (
    <OCRContext.Provider
      value={{
        cooldownUntil,
        setCooldown,
        clearCooldown,
        isOnCooldown,
        remainingTime,
      }}
    >
      {children}
    </OCRContext.Provider>
  );
};

export const useOCR = () => {
  const context = useContext(OCRContext);
  if (!context) {
    throw new Error('useOCR must be used within an OCRProvider');
  }
  return context;
};

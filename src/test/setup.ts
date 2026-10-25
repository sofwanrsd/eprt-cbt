import '@testing-library/jest-dom/vitest';

// Mock Web Audio API for tests
class AudioContextMock {
  state = 'running';
  currentTime = 0;
  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }
  destination = {};
  resume = () => Promise.resolve();
}

(globalThis as any).AudioContext = AudioContextMock;
(globalThis as any).webkitAudioContext = AudioContextMock;

// Mock window.speechSynthesis
const speechSynthesisMock = {
  speak: () => {},
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  getVoices: () => [
    { name: 'Google US English', lang: 'en-US', default: true },
    { name: 'Microsoft David', lang: 'en-US', default: false }
  ],
};

Object.defineProperty(window, 'speechSynthesis', {
  value: speechSynthesisMock,
  writable: true,
});

(globalThis as any).SpeechSynthesisUtterance = class {
  text = '';
  lang = 'en-US';
  rate = 1;
  voice = null;
  onend = () => {};
  onerror = () => {};
  constructor(text?: string) {
    if (text) this.text = text;
  }
};

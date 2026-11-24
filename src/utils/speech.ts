let currentUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function speakChinese(
  text: string,
  options?: { rate?: number; onEnd?: () => void }
): void {
  if (!isSpeechSupported()) {
    options?.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = options?.rate ?? 0.92;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice =
    voices.find((v) => v.lang === 'zh-CN' && v.localService) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('zh-cn')) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('zh'));

  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    options?.onEnd?.();
  };
  utterance.onerror = () => {
    currentUtterance = null;
    options?.onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function isSpeaking(): boolean {
  return currentUtterance !== null;
}

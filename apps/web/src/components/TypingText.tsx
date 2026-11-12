import { useState, useEffect } from 'react';
import { TYPING_WORDS } from '../lib/constants';

export default function TypingText() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function type() {
      const currentWord = TYPING_WORDS[wordIndex];

      if (!isDeleting && charIndex < currentWord.length) {
        setDisplayText(currentWord.substring(0, charIndex + 1));
        charIndex++;
        timer = setTimeout(type, 100);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentWord.substring(0, charIndex - 1));
        charIndex--;
        timer = setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % TYPING_WORDS.length;
        }
        timer = setTimeout(type, isDeleting ? 1000 : 500);
      }
    }

    timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, []);

  return <span className="typing-text">{displayText}</span>;
}

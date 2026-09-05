import React, { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  className = '',
  style = {},
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 30);

    return () => clearTimeout(timer);
  }, []);

  const lines = text.split('\n');
  const wordDelay = 60; // ms
  const initialDelay = 150; // ms
  const transitionDuration = 600; // ms

  return (
    <h1
      className={`font-bold ${className}`}
      style={{
        ...style,
      }}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <span key={lineIndex} className="block leading-tight">
            {words.map((word, wordIndex) => {
              const delay = initialDelay + (lineIndex * 4 + wordIndex) * wordDelay;

              return (
                <span
                  key={wordIndex}
                  className="inline-block ml-2.5 last:ml-0"
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? 'translateX(0)' : 'translateX(18px)',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: `${transitionDuration}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${delay}ms`,
                    willChange: 'opacity, transform',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};

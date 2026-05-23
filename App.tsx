import { useEffect, useState } from 'react';
import './index.css';
import type { Letter } from './types';

const LETTERS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ',
  'O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

  
const TOTAL_TIME = 8 * 60; // 8 minutos en segundos

export default function App() {
  const [letters, setLetters] = useState<Letter[]>(
    LETTERS.map(l => ({ char: l, status: 'pending' }))
  );

  // const isMobile = window.innerWidth < 500; // 👈 DETECCIÓN
  
  
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      const roscoSize = Math.min(window.innerWidth * 0.9, 500);
      setRadius(roscoSize / 2 - 40);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);


  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 500);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);


  
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [current, setCurrent] = useState(0);

  const updateStatus = (status: Letter['status']) => {
    setLetters(prev =>
      prev.map((l, i) =>
        i === current ? { ...l, status } : l
      )
    );
    
    if (status === 'pass') {
      setIsRunning(false); // ⏸️ pausa el timer
    }
    moveNext();
  };

  
  useEffect(() => {
    if (timeLeft === 0) {
      alert('¡Se acabó el tiempo!');
      setIsRunning(false);
    }
  }, [timeLeft]);
  
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  
  // const roscoSize = Math.min(window.innerWidth * 0.9, 500);
  // const radius = roscoSize / 2 - 40; // ← margen para que no se corte


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const moveNext = () => {
    
    const total = letters.length;

    let next = current;

    for (let i = 0; i < total; i++) {
      next = (next + 1) % total;

      if (letters[next].status === 'pass' || letters[next].status === 'pending') {
        setCurrent(next);
        return;
      }
    }

    // Si no encontró ninguna "pass"
    alert('¡Juego terminado!');

  };

  return (
    <div className="app">
      <div className="rosco">
        {letters.map((letter, index) => {
          const angle = (360 / letters.length) * index;          
          return (
            <div
              key={letter.char}
              className={`letter ${letter.status} ${index === current ? 'active' : ''}`}
              style={{
                '--angle': `${angle}deg`,
                '--radius': `${radius}px`,
              } as React.CSSProperties}
            >
              {letter.char}
            </div>
          );
        })}
        {/* <div className="center-text">Pasapalabra</div> */}
      </div>

      <div className="controls">
        <div className="timer">
          <span className="time">{formatTime(timeLeft)}</span>
          <button onClick={toggleTimer}>
            {isRunning ? 'Pausar' :  timeLeft === 480 ? 'Comenzar' : 'Reanudar'}
          </button>
        </div>  
        <button className="ok" onClick={() => updateStatus('ok')}>OK</button>
        <button className="error" onClick={() => updateStatus('error')}>ERROR</button>
        <button className="pass" onClick={() => updateStatus('pass')}>PASAPALABRA</button>
      </div>
    </div>
  );
}



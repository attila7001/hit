import React, { useState, useEffect, useRef } from 'react';

const HITTrainingApp = () => {
  // Einstellungen
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [pauseDuration, setPauseDuration] = useState(15);
  const [totalExercises, setTotalExercises] = useState(8);
  
  // Training Modi
  const [trainingMode, setTrainingMode] = useState('dashboard');
  
  // Visuelles Blinken
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Countdown vor Training
  const [startCountdown, setStartCountdown] = useState(0);
  
  // Klassische HIT Übungen
  const hitExercises = [
    "Jumping Jacks",
    "Wall Sit",
    "Push-ups",
    "Crunches", 
    "Step-ups",
    "Squats",
    "Triceps Dips",
    "Plank",
    "High Knees",
    "Lunges",
    "Push-up Rotation",
    "Side Plank",
    "Burpees",
    "Mountain Climbers"
  ];
  
  // Training Status
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);
  const [isExercisePhase, setIsExercisePhase] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sidePlankSide, setSidePlankSide] = useState('rechts');
  
  // Audio Context für Pieptöne
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Audio Context initialisieren
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  
  // Visuelles Blinken für Countdown
  const triggerVisualCountdown = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 200);
    
    setTimeout(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 500);
    
    setTimeout(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 1000);
  };
  
  // Pieptöne erzeugen
  const playBeep = (frequency = 200, duration = 200) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };
  
  // Seitenwechsel Signal für Side Plank
  const playSideSwitchBeep = () => {
    playBeep(400, 300);
  };
  
  // Training Modi starten mit 3-Sekunden Countdown
  const start7MinuteHIT = () => {
    setTrainingMode('training');
    setExerciseDuration(30);
    setPauseDuration(10);
    setTotalExercises(12);
    setCurrentExercise(1);
    setIsExercisePhase(true);
    setSidePlankSide('rechts');
    setIsRunning(false);
    
    // 3-Sekunden Countdown
    setStartCountdown(3);
    const countdownTimer = setInterval(() => {
      setStartCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          // Training tatsächlich starten
          initAudio();
          setIsRunning(true);
          setTimeLeft(30);
          setTimeout(() => playCountdown(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const start15LongVersion = () => {
    setTrainingMode('training');
    setExerciseDuration(30);
    setPauseDuration(15);
    setTotalExercises(14);
    setCurrentExercise(1);
    setIsExercisePhase(true);
    setSidePlankSide('rechts');
    setIsRunning(false);
    
    // 3-Sekunden Countdown
    setStartCountdown(3);
    const countdownTimer = setInterval(() => {
      setStartCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          // Training tatsächlich starten
          initAudio();
          setIsRunning(true);
          setTimeLeft(30);
          setTimeout(() => playCountdown(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const startCustomTraining = () => {
    setTrainingMode('settings');
  };
  
  // Countdown Pieptöne (3-2-1) mit visuellem Blinken
  const playCountdown = () => {
    triggerVisualCountdown();
    playBeep(200, 200);
    setTimeout(() => playBeep(200, 200), 500);
    setTimeout(() => playBeep(200, 200), 1000);
  };
  
  // Training starten (für freie Wahl)
  const startTraining = () => {
    setTrainingMode('training');
    setCurrentExercise(1);
    setIsExercisePhase(true);
    setSidePlankSide('rechts');
    setIsRunning(false);
    
    // 3-Sekunden Countdown
    setStartCountdown(3);
    const countdownTimer = setInterval(() => {
      setStartCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          // Training tatsächlich starten
          initAudio();
          setIsRunning(true);
          setTimeLeft(exerciseDuration);
          setTimeout(() => playCountdown(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Training pausieren/fortsetzen
  const togglePause = () => {
    setIsRunning(!isRunning);
  };
  
  // Training stoppen
  const stopTraining = () => {
    setIsRunning(false);
    setTrainingMode('dashboard');
    setCurrentExercise(1);
    setIsExercisePhase(true);
    setTimeLeft(exerciseDuration);
    setSidePlankSide('rechts');
    setStartCountdown(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  // Timer Logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          // Side Plank Seitenwechsel bei 15 Sekunden
          if (isExercisePhase && hitExercises[(currentExercise - 1) % hitExercises.length] === "Side Plank" && prevTime === 16) {
            setSidePlankSide('links');
            setTimeout(() => playSideSwitchBeep(), 100);
          }
          
          if (prevTime <= 1) {
            // Phase wechseln
            if (isExercisePhase) {
              // Von Übung zu Pause
              if (currentExercise < totalExercises) {
                setIsExercisePhase(false);
                return pauseDuration;
              } else {
                // Training beendet
                setIsRunning(false);
                setTrainingMode('dashboard');
                return 0;
              }
            } else {
              // Von Pause zu nächster Übung
              setIsExercisePhase(true);
              setCurrentExercise(prev => prev + 1);
              setSidePlankSide('rechts');
              // Countdown vor neuer Übung
              setTimeout(() => playCountdown(), 500);
              return exerciseDuration;
            }
          } else {
            // Countdown bei 3 Sekunden vor Ende
            if (prevTime === 4) {
              setTimeout(() => playCountdown(), 500);
            }
            return prevTime - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isExercisePhase, currentExercise, totalExercises, exerciseDuration, pauseDuration]);
  
  // Kreis-Animation berechnen
  const maxTime = isExercisePhase ? exerciseDuration : pauseDuration;
  const progress = (maxTime - timeLeft) / maxTime;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Übungsname mit Side Plank Seite
  const getCurrentExerciseName = () => {
    const exerciseName = hitExercises[(currentExercise - 1) % hitExercises.length];
    if (exerciseName === "Side Plank") {
      return `Side Plank (${sidePlankSide})`;
    }
    return exerciseName;
  };

  // CSS Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: startCountdown > 0 
        ? `linear-gradient(135deg, hsl(${(3 - startCountdown) * 120}, 70%, 50%) 0%, hsl(${(3 - startCountdown) * 120 + 30}, 70%, 60%) 100%)`
        : isBlinking 
          ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
          : 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
      transition: 'background 1s ease'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      width: '100%',
      maxWidth: '28rem',
      textAlign: 'center'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      marginBottom: '32px',
      color: '#1f2937'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    button: {
      width: '100%',
      padding: '16px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: 'white'
    },
    button7Min: {
      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
    },
    button14er: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
    },
    buttonFree: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonText: {
      fontSize: '14px',
      fontWeight: 'normal',
      opacity: 0.8,
      marginTop: '4px'
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      textAlign: 'left'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    trainingHeader: {
      marginBottom: '24px'
    },
    trainingTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    trainingSubtitle: {
      fontSize: '18px',
      color: '#6b7280'
    },
    exerciseName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2563eb',
      marginTop: '8px'
    },
    timerContainer: {
      position: 'relative',
      marginBottom: '32px'
    },
    timerInner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    timeDisplay: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    phaseDisplay: {
      fontSize: '18px',
      fontWeight: '600'
    },
    controlContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '16px'
    },
    controlButton: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      color: 'white'
    },
    dashboardButton: {
      background: 'none',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
      margin: '0 auto'
    }
  };
  
  if (trainingMode === 'dashboard') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>HIT Training</h1>
          
          <div style={styles.buttonContainer}>
            <button
              onClick={start7MinuteHIT}
              style={{...styles.button, ...styles.button7Min}}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              7-Minuten HIT
              <div style={styles.buttonText}>
                12 Übungen • 30s Training • 10s Pause
              </div>
            </button>
            
            <button
              onClick={start15LongVersion}
              style={{...styles.button, ...styles.button14er}}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              14er Long Version
              <div style={styles.buttonText}>
                14 Übungen • 30s Training • 15s Pause
              </div>
            </button>
            
            <button
              onClick={startCustomTraining}
              style={{...styles.button, ...styles.buttonFree}}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Freie Wahl
              <div style={styles.buttonText}>
                Individuelle Einstellungen
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (trainingMode === 'settings') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>HIT Training</h1>
          
          <div style={styles.inputContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Übungsdauer (Sekunden)
              </label>
              <input
                type="number"
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(Number(e.target.value))}
                style={styles.input}
                min="10"
                max="300"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Pausendauer (Sekunden)
              </label>
              <input
                type="number"
                value={pauseDuration}
                onChange={(e) => setPauseDuration(Number(e.target.value))}
                style={styles.input}
                min="5"
                max="120"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Anzahl Übungen
              </label>
              <input
                type="number"
                value={totalExercises}
                onChange={(e) => setTotalExercises(Number(e.target.value))}
                style={styles.input}
                min="1"
                max="20"
              />
            </div>
            
            <button
              onClick={startTraining}
              style={{...styles.button, background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)'}}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Training starten
            </button>
            
            <button
              onClick={() => setTrainingMode('dashboard')}
              style={{...styles.button, background: '#6b7280'}}
              onMouseOver={(e) => e.target.style.background = '#4b5563'}
              onMouseOut={(e) => e.target.style.background = '#6b7280'}
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {startCountdown > 0 ? (
          // 3-Sekunden Countdown Anzeige
          <div style={{textAlign: 'center'}}>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px'}}>
              Training startet in...
            </h2>
            <div style={{fontSize: '72px', fontWeight: 'bold', color: '#1f2937'}}>
              {startCountdown}
            </div>
          </div>
        ) : (
          // Normales Training Interface
          <>
            <div style={styles.trainingHeader}>
              <h2 style={styles.trainingTitle}>
                {(exerciseDuration === 30 && (pauseDuration === 10 || pauseDuration === 15)) ? (
                  // 7-Min oder 14er Long - Übungsname oben anzeigen
                  isExercisePhase ? getCurrentExerciseName() : 'PAUSE'
                ) : (
                  // Freie Wahl - nur ÜBUNG/PAUSE anzeigen
                  isExercisePhase ? 'ÜBUNG' : 'PAUSE'
                )}
              </h2>
              <p style={styles.trainingSubtitle}>
                Übung {currentExercise} von {totalExercises}
              </p>
              {/* Nächste Übung in Pause anzeigen (nur für 7-Min und 14er Long) */}
              {!isExercisePhase && (exerciseDuration === 30 && (pauseDuration === 10 || pauseDuration === 15)) && currentExercise < totalExercises && (
                <div style={{marginTop: '16px'}}>
                  <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Als nächstes:</div>
                  <h3 style={styles.exerciseName}>
                    {hitExercises[currentExercise % hitExercises.length]}
                  </h3>
                </div>
              )}
            </div>
            
            {/* Visueller Timer */}
            <div style={styles.timerContainer}>
              <svg width="256" height="256" viewBox="0 0 200 200" style={{transform: 'rotate(-90deg)'}}>
                {/* Hintergrund Kreis */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Fortschritts Kreis */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke={isExercisePhase ? "#ef4444" : "#22c55e"}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{transition: 'all 1s linear'}}
                />
              </svg>
              
              {/* Zeit Anzeige */}
              <div style={styles.timerInner}>
                <div style={styles.timeDisplay}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            
            {/* Kontrollen */}
            <div style={styles.controlContainer}>
              <button
                onClick={togglePause}
                style={{
                  ...styles.controlButton,
                  background: isRunning ? '#f97316' : '#22c55e'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                {isRunning ? 'Pause' : 'Weiter'}
              </button>
              
              <button
                onClick={stopTraining}
                style={{...styles.controlButton, background: '#ef4444'}}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Stopp
              </button>
            </div>
            
            <button
              onClick={stopTraining}
              style={styles.dashboardButton}
            >
              Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HITTrainingApp;
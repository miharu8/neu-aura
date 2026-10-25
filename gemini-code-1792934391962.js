import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [brainState, setBrainState] = useState('overload');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  
  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);

  const startAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(432, ctx.currentTime);
    osc2.frequency.setValueAtTime(439.83, ctx.currentTime); // 432 + 7.83 (シューマン共振差)

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();

    oscillatorsRef.current = [osc1, osc2];
    setIsPlaying(true);
  };

  const stopAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  useEffect(() => {
    let timer;
    if (step === 2 && isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopAudio();
      setStep(3);
    }
    return () => clearInterval(timer);
  }, [step, isPlaying, timeLeft]);

  const handleStartSession = () => {
    setStep(2);
    startAudio();
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>Neu-Aura</h1>
        <p style={styles.subtitle}>感覚過敏・脳疲労のためのパーソナル周波数チューナー</p>

        {step === 1 && (
          <div style={styles.card}>
            <h2>今のあなたの脳と神経の状態は？</h2>
            <div style={styles.buttonGroup}>
              <button 
                style={brainState === 'overload' ? styles.selectedBtn : styles.btn}
                onClick={() => setBrainState('overload')}
              >
                情報の洪水で頭がパンクしている
              </button>
              <button 
                style={brainState === 'noise' ? styles.selectedBtn : styles.btn}
                onClick={() => setBrainState('noise')}
              >
                外部の音や刺激がうるさく感じる
              </button>
              <button 
                style={brainState === 'loop' ? styles.selectedBtn : styles.btn}
                onClick={() => setBrainState('loop')}
              >
                思考のループが止まらない
              </button>
            </div>
            <button style={styles.primaryBtn} onClick={handleStartSession}>
              3分間の調律セッションを始める（無料）
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.card}>
            <div style={styles.timer}>
              残り時間: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
            </div>
            
            <div style={styles.pulseContainer}>
              <div className="pulsing-circle" style={styles.pulsingCircle}></div>
            </div>

            <p style={styles.guideText}>呼吸を深く落とし、耳から入る432Hzの波長に意識を預けてください。</p>
            
            <button style={styles.stopBtn} onClick={() => { stopAudio(); setStep(1); setTimeLeft(180); }}>
              セッションを中断する
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.card}>
            <h2>神経系のリセットが完了しました</h2>
            <p style={styles.desc}>
              頭の奥のノイズが和らいだ感覚を、あなたの日常にいつでも定着させるために。
            </p>
            <div style={styles.priceBox}>
              <p><strong>パーソナル調律アセット（完全版Webアプリ＋音源WAVパック）</strong></p>
              <p style={styles.price}>¥9,800 <span style={styles.tax}>(税込)</span></p>
            </div>
            <button style={styles.checkoutBtn} onClick={() => alert('Stripe決済リンクへ接続します')}>
              完全版を手に入れる（Stripe決済）
            </button>
            <button style={styles.textBtn} onClick={() => { setStep(1); setTimeLeft(180); }}>
              最初に戻る
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  main: {
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '5px',
    letterSpacing: '2px',
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid #334155',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    margin: '20px 0 30px 0',
  },
  btn: {
    backgroundColor: '#334155',
    color: '#cbd5e1',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  selectedBtn: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: '1px solid #38bdf8',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  primaryBtn: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    padding: '16px',
    width: '100%',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  timer: {
    fontSize: '1.5rem',
    fontVariantNumeric: 'tabular-nums',
    color: '#38bdf8',
    marginBottom: '20px',
  },
  pulseContainer: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  pulsingCircle: {
    width: '100px',
    height: '100px',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: '50%',
    border: '2px solid #38bdf8',
  },
  guideText: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '25px',
    lineHeight: '1.5',
  },
  stopBtn: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid #475569',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  desc: {
    fontSize: '0.9rem',
    color: '#cbd5e1',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  priceBox: {
    backgroundColor: '#0f172a',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #334155',
  },
  price: {
    fontSize: '1.5rem',
    color: '#38bdf8',
    fontWeight: 'bold',
    marginTop: '5px',
  },
  tax: {
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  checkoutBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '16px',
    width: '100%',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '12px',
  },
  textBtn: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
  }
};
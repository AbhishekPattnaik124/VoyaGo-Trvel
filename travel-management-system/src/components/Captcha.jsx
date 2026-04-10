import React, { useEffect, useRef, useState } from 'react';

const Captcha = ({ onValidate }) => {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let length = 6;
    let text = '';
    for (let i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    drawCaptcha(text);
    onValidate(false); 
    setUserInput('');
  };

  const drawCaptcha = (text) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.5)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    
    ctx.font = '22px Arial';
    ctx.fillStyle = '#1e293b';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    for(let i=0; i<text.length; i++) {
      ctx.save();
      ctx.translate(canvas.width/text.length * i + 12, canvas.height/2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setUserInput(e.target.value);
    if (e.target.value === captchaText) {
      onValidate(true);
    } else {
      onValidate(false);
    }
  };

  return (
    <div className="captcha-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <canvas 
          ref={canvasRef} 
          width="150" 
          height="45" 
          style={{ borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} 
          onClick={generateCaptcha} 
          title="Click to refresh CAPTCHA" 
        />
        <button 
          type="button" 
          onClick={generateCaptcha} 
          style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', cursor: 'pointer', padding: '10px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Refresh CAPTCHA"
        >
          ↻
        </button>
      </div>
      <div className="input-box" style={{ marginBottom: 0 }}>
        <input 
          type="text" 
          placeholder="Enter CAPTCHA" 
          value={userInput} 
          onChange={handleChange} 
          required 
          style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', outline: 'none', color: 'white' }}
        />
      </div>
    </div>
  );
};

export default Captcha;

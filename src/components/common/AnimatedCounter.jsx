import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1000, className = '' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (value === undefined || value === null) {
      setDisplayValue('0');
      return;
    }

    const strVal = String(value).trim();
    const match = strVal.match(/^([^\d.-]*)([\d,.]+)(.*)$/);

    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetNum = parseFloat(numStr);

    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const hasCommas = match[2].includes(',');
    const decimalPlaces = (numStr.split('.')[1] || '').length;

    let start = prevValueRef.current;
    if (isNaN(start)) start = 0;
    prevValueRef.current = targetNum;

    let startTimestamp = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = start + (targetNum - start) * easeProgress;

      let formattedNum = currentNum.toFixed(decimalPlaces);
      if (hasCommas) {
        const parts = formattedNum.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedNum = parts.join('.');
      }

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
}

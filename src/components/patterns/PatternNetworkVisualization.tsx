
import React, { useEffect, useRef } from 'react';

interface Pattern {
  id: string;
  title: string;
  confidence: number;
  severity: string;
}

interface PatternNetworkVisualizationProps {
  patterns: Pattern[];
}

const PatternNetworkVisualization: React.FC<PatternNetworkVisualizationProps> = ({ patterns }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;
      const radius = 80;

      // Draw central AI node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.strokeStyle = '#3730a3';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw pulsing ring around center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20 + Math.sin(time * 2) * 5, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(79, 70, 229, ${0.3 + Math.sin(time * 2) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pattern nodes and connections
      patterns.forEach((pattern, index) => {
        const angle = (index / patterns.length) * 2 * Math.PI + time * 0.5;
        const nodeX = centerX + Math.cos(angle) * radius;
        const nodeY = centerY + Math.sin(angle) * radius;

        // Draw connection line with animation
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        const opacity = 0.4 + Math.sin(time * 3 + index) * 0.3;
        ctx.strokeStyle = pattern.severity === 'critical' 
          ? `rgba(239, 68, 68, ${opacity})` 
          : `rgba(245, 158, 11, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw pattern node
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 12, 0, 2 * Math.PI);
        ctx.fillStyle = pattern.severity === 'critical' ? '#ef4444' : '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = pattern.severity === 'critical' ? '#dc2626' : '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw confidence indicator
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 8, 0, (pattern.confidence / 100) * 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw data flow particles
      for (let i = 0; i < 6; i++) {
        const particleTime = time * 2 + i * 0.5;
        const progress = (particleTime % 1);
        const angle = (i / 6) * 2 * Math.PI;
        const startX = centerX;
        const startY = centerY;
        const endX = centerX + Math.cos(angle) * radius;
        const endY = centerY + Math.sin(angle) * radius;
        
        const particleX = startX + (endX - startX) * progress;
        const particleY = startY + (endY - startY) * progress;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(79, 70, 229, ${1 - progress})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [patterns]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div className="font-semibold text-indigo-900 mb-1">Pattern Fusion Engine</div>
        <div className="text-indigo-700">
          Processing {patterns.length} impossible correlations
        </div>
        <div className="text-indigo-600 text-xs mt-1">
          Real-time multi-domain analysis
        </div>
      </div>
    </div>
  );
};

export default PatternNetworkVisualization;

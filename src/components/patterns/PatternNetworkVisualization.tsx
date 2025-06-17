
import React, { useEffect, useRef, useState } from 'react';
import { UnifiedPattern } from '../../hooks/useSharedPatternState';

interface PatternNetworkVisualizationProps {
  patterns: UnifiedPattern[];
  selectedPattern?: string | null;
  onPatternClick?: (patternId: string) => void;
}

const PatternNetworkVisualization: React.FC<PatternNetworkVisualizationProps> = ({ 
  patterns, 
  selectedPattern,
  onPatternClick 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPattern, setHoveredPattern] = useState<string | null>(null);

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

    // Store node positions for click detection
    const nodePositions: { [key: string]: { x: number; y: number; radius: number } } = {};

    const animate = () => {
      time += 0.02;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;
      const radius = 100;

      // Draw central AI node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
      ctx.fillStyle = selectedPattern ? '#3730a3' : '#4f46e5';
      ctx.fill();
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw pulsing ring around center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25 + Math.sin(time * 2) * 8, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(79, 70, 229, ${0.4 + Math.sin(time * 2) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pattern nodes and connections
      patterns.forEach((pattern, index) => {
        const angle = (index / patterns.length) * 2 * Math.PI + time * 0.3;
        const nodeX = centerX + Math.cos(angle) * radius;
        const nodeY = centerY + Math.sin(angle) * radius;
        const nodeRadius = 18;

        // Store position for click detection
        nodePositions[pattern.id] = { x: nodeX, y: nodeY, radius: nodeRadius };

        const isSelected = selectedPattern === pattern.id;
        const isHovered = hoveredPattern === pattern.id;

        // Draw connection line with animation
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        const opacity = isSelected ? 0.8 : 0.4 + Math.sin(time * 3 + index) * 0.3;
        const lineWidth = isSelected ? 4 : 2;
        ctx.strokeStyle = pattern.severity === 'critical' 
          ? `rgba(239, 68, 68, ${opacity})` 
          : `rgba(245, 158, 11, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Draw pattern node
        const nodeSize = isSelected || isHovered ? nodeRadius + 4 : nodeRadius;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeSize, 0, 2 * Math.PI);
        ctx.fillStyle = pattern.severity === 'critical' ? '#ef4444' : '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#1e1b4b' : 
                         pattern.severity === 'critical' ? '#dc2626' : '#d97706';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        // Draw confidence indicator
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeSize - 4, 0, (pattern.confidence / 100) * 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, nodeSize + 8, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(79, 70, 229, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw data flow particles
      for (let i = 0; i < 8; i++) {
        const particleTime = time * 2 + i * 0.3;
        const progress = (particleTime % 1);
        const angle = (i / 8) * 2 * Math.PI;
        const startX = centerX;
        const startY = centerY;
        const endX = centerX + Math.cos(angle) * radius;
        const endY = centerY + Math.sin(angle) * radius;
        
        const particleX = startX + (endX - startX) * progress;
        const particleY = startY + (endY - startY) * progress;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(79, 70, 229, ${1 - progress})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let foundHover = null;
      for (const [patternId, pos] of Object.entries(nodePositions)) {
        const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
        if (distance <= pos.radius) {
          foundHover = patternId;
          canvas.style.cursor = 'pointer';
          break;
        }
      }

      if (!foundHover) {
        canvas.style.cursor = 'default';
      }

      setHoveredPattern(foundHover);
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (const [patternId, pos] of Object.entries(nodePositions)) {
        const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
        if (distance <= pos.radius) {
          onPatternClick?.(patternId);
          break;
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [patterns, selectedPattern, hoveredPattern, onPatternClick]);

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
          {patterns.length} impossible correlations detected
        </div>
        <div className="text-indigo-600 text-xs mt-1">
          Click nodes to explore impacts
        </div>
      </div>
      
      {selectedPattern && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <div className="font-semibold text-slate-900 mb-1">Pattern Selected</div>
          <div className="text-slate-700">
            {patterns.find(p => p.id === selectedPattern)?.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternNetworkVisualization;

"use client";
import React from "react";
export default function BackgroundAnimation() {
  return (
    <div className="animated-bg">
      <div className="mesh-gradient"></div>
      <div className="orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="glass-overlay"></div>
      <style jsx>{`
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #0f172a;
          overflow: hidden;
          z-index: -1;
        }
        .mesh-gradient {
          position: absolute;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(at 0% 0%, rgba(30, 64, 175, 0.3) 0, transparent 50%),
            radial-gradient(at 100% 0%, rgba(37, 99, 235, 0.2) 0, transparent 50%),
            radial-gradient(at 100% 100%, rgba(30, 58, 138, 0.3) 0, transparent 50%),
            radial-gradient(at 0% 100%, rgba(29, 78, 216, 0.2) 0, transparent 50%);
          filter: blur(100px);
        }
        .orbs {
          position: absolute;
          width: 100%;
          height: 100%;
          filter: blur(60px);
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          mix-blend-mode: screen;
          animation: move 20s infinite alternate ease-in-out;
        }
        .orb-1 {
          width: 500px;
          height: 500px;
          background: rgba(37, 99, 235, 0.2);
          left: -10%;
          top: -10%;
        }
        .orb-2 {
          width: 600px;
          height: 600px;
          background: rgba(30, 58, 138, 0.15);
          right: -5%;
          bottom: -5%;
          animation-duration: 25s;
          animation-delay: -5s;
        }
        .orb-3 {
          width: 400px;
          height: 400px;
          background: rgba(29, 78, 216, 0.1);
          left: 40%;
          top: 30%;
          animation-duration: 30s;
          animation-delay: -10s;
        }
        .glass-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%);
        }
        @keyframes move {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(100px, 50px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

import React, { useRef, useEffect, useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import * as pose from '@mediapipe/pose';
import { estimatePose } from '../MissionEstimators/PoseEstimator';
import styled from 'styled-components';

const GameMode1MediaPipe = () => {
  const { myVideoRef } = useContext(GameContext);
  const canvasRef = useRef(null);
  const msPoseRef = useRef(null);

  useEffect(() => {
    const videoElement = myVideoRef.current;

    msPoseRef.current = new pose.Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    msPoseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    msPoseRef.current.onResults(results =>
      estimatePose({ results, myVideoRef, canvasRef }),
    );

    const handleCanPlay = () => {
      msPoseRef.current.send({ image: videoElement }).then(() => {
        requestAnimationFrame(handleCanPlay);
      });
    };

    videoElement.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      msPoseRef.current.close();
    };
  }, [myVideoRef]);

  return <Canvas ref={canvasRef} />;
};

export default GameMode1MediaPipe;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  object-fit: cover;
`;

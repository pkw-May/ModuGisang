import React, { useContext, useState, useEffect } from 'react';
import {
  AccountContext,
  GameContext,
  OpenViduContext,
  UserContext,
} from '../../../contexts';
import useFetch from '../../../hooks/useFetch';
import { inGameServices, userServices } from '../../../apis';
import { LoadingWithText } from '../../../components';
import { TheRestVideo } from './';

import {
  Waiting,
  Mission1,
  Mission2,
  Mission3,
  Mission4,
  Affirmation,
  Result,
} from '../';
import styled, { css } from 'styled-components';

const GAME_MODE = {
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'mission3',
  4: 'mission4',
  5: 'affirmation',
  6: 'result',
};

const GAME_MODE_COMPONENTS = {
  0: <Waiting />,
  1: <Mission1 />,
  2: <Mission2 />,
  3: <Mission3 />,
  4: <Mission4 />,
  5: <Affirmation />,
  6: <Result />,
};

const RESULT_HEADER_TEXT = '오늘의 미라클 메이커';

const MyVideo = () => {
  const { fetchData } = useFetch();

  const { accessToken, userId: myId } = useContext(AccountContext);

  const { myVideoRef, myStream, mateStreams } = useContext(OpenViduContext);
  const { myMissionStatus, inGameMode, isGameResultReceived } =
    useContext(GameContext);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (myVideoRef && myStream) {
      myStream.addVideoElement(myVideoRef.current);
    }
  }, [myStream, myVideoRef]);

  useEffect(() => {
    const handleVideoLoading = () => {
      setIsVideoLoading(false);
    };

    if (myVideoRef.current) {
      myVideoRef.current.addEventListener('playing', handleVideoLoading);
    }

    return () => {
      if (myVideoRef.current) {
        myVideoRef.current.removeEventListener('playing', handleVideoLoading);
      }
    };
  }, [myVideoRef]);

  return (
    <Wrapper>
      {isVideoLoading && (
        <LoadingWithText loadingMSG="카메라를 인식 중이에요" />
      )}

      {[0, 1, 2, 3, 4, 5].includes(inGameMode) && (
        <React.Fragment key={inGameMode}>
          {GAME_MODE_COMPONENTS[inGameMode]}
        </React.Fragment>
      )}
      {GAME_MODE[inGameMode] === 'result' && <Result />}
      <Video
        ref={myVideoRef}
        autoPlay
        playsInline
        $isWaitingMode={GAME_MODE[inGameMode] === 'wating'}
        $myMissionStatus={myMissionStatus}
        $isResultMode={GAME_MODE[inGameMode] === 'result'}
        $amTheTopUser={true}
      />
    </Wrapper>
  );
};

export default MyVideo;

const Wrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.flex.center};

  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  position: absolute;
  top: 0;

  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.radius.medium};
  border: ${({ theme, $isWaitingMode, $myMissionStatus, $isResultMode }) =>
    $isWaitingMode
      ? `solid 3px ${theme.colors.primary.white}`
      : $isResultMode
        ? `solid 3px transparent`
        : $myMissionStatus
          ? `solid 3px ${theme.colors.primary.emerald}`
          : `solid 3px ${theme.colors.system.red}`};

  object-fit: cover;
`;

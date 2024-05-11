import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserContext,
  ChallengeContext,
  GameContext,
  OpenViduContext,
} from '../../contexts';
import useCheckTime from '../../hooks/useCheckTime';

import InGameNav from './components/Nav/InGameNav';
import { MyVideo, MateVideo } from './components';
import {
  Waiting,
  Mission1,
  Mission2,
  Mission3,
  Mission4,
  Affirmation,
  Result,
} from './';

import BackgroundMusic from './BackgroundMusic';
import styled from 'styled-components';
import GameSoundEffects from './GameSoundEffects';

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

const InGame = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const { userId: myId } = userData;
  const { challengeData } = useContext(ChallengeContext);
  const { isTooEarly, isTooLate } = useCheckTime(challengeData?.wakeTime);
  const { inGameMode, myMissionStatus, setMyMissionStatus, isGameLoading } =
    useContext(GameContext);
  const { myStream, myVideoRef } = useContext(OpenViduContext);
  const [redirected, setRedirected] = useState(false);

  const [mateList, setMateList] = useState([]);

  // const musicSrc = getMusicSrc(inGameMode);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData?.mates?.filter(mate => mate.userId !== myId));
    } else return;
  }, [challengeData]);

  useEffect(() => {
    // ================== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================
    // -------------⭐️ 개발 완료 후 주석 해제 필요 ⭐️ -------------
    // ================== ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️ ==================
    // if (GAME_MODE[inGameMode] === 'waiting') {
    //   if (isTooLate) {
    //     alert('챌린지 참여 시간이 지났습니다.');
    //     setRedirected(true);
    //     navigate('/main');
    //   } else if (isTooEarly) {
    //     alert('챌린지 시작 시간이 아닙니다.');
    //     setRedirected(true);
    //     navigate('/main');
    //   }
    // }

    console.log('inGameMode:', inGameMode);

    return () => {
      // localStorage.removeItem('inGameMode');
      if (myVideoRef.current) {
        if (myStream instanceof MediaStream) {
          myStream.getTracks().forEach(track => track.stop());
          myVideoRef.current.srcObject = null;
        }
      }
    };
  }, [inGameMode, isTooEarly, isTooLate, redirected]);

  if (redirected) return null;
  return (
    <>
      <InGameNav />
      <BackgroundMusic gameMode={inGameMode} playing={true} />
      <GameSoundEffects />

      <Wrapper>
        <MyVideo />

        <React.Fragment key={inGameMode}>
          {GAME_MODE_COMPONENTS[inGameMode]}
        </React.Fragment>

        {mateList?.length > 0 && (
          <MatesVideoWrapper $isSingle={mateList?.length === 1}>
            {mateList?.map(({ userId, userName }) => (
              <MateVideo key={userId} mateId={userId} mateName={userName} />
            ))}
          </MatesVideoWrapper>
        )}
      </Wrapper>
    </>
  );
};

export default InGame;

const Wrapper = styled.div``;

const MatesVideoWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  width: 100vw;
  padding: 0px 32px;
  ${({ theme, $isSingle }) =>
    $isSingle ? theme.flex.right : theme.flex.between}
  gap: 10px;
`;

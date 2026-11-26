import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import config from './config/weddingConfig.js';
import { MusicProvider } from './context/MusicContext.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import WeddingVideo from './components/WeddingVideo.jsx';
import BackgroundMusic from './components/BackgroundMusic.jsx';
import Blossom from './components/ui/Blossom.jsx';

// Below-the-fold content is split out so the welcome screen loads fast on mobile data.
const InvitationPage = lazy(() => import('./components/InvitationPage.jsx'));

const STAGES = { WELCOME: 'welcome', VIDEO: 'video', INVITATION: 'invitation' };

function PageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ivory" role="status" aria-label="Loading">
      <div className="animate-spin [animation-duration:2.5s]">
        <Blossom size={48} />
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState(STAGES.WELCOME);
  const videoEnabled = config.media.video.enabled && Boolean(config.media.video.src);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [stage]);

  const openInvitation = useCallback(() => setStage(videoEnabled ? STAGES.VIDEO : STAGES.INVITATION), [videoEnabled]);
  const showInvitation = useCallback(() => setStage(STAGES.INVITATION), []);
  const replayVideo = useCallback(() => setStage(STAGES.VIDEO), []);

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <AnimatePresence mode="wait">
          {stage === STAGES.WELCOME && <WelcomeScreen key="welcome" onOpen={openInvitation} />}
          {stage === STAGES.VIDEO && <WeddingVideo key="video" onFinish={showInvitation} />}
          {stage === STAGES.INVITATION && (
            <Suspense key="invitation" fallback={<PageLoader />}>
              <InvitationPage onReplayVideo={videoEnabled ? replayVideo : undefined} />
            </Suspense>
          )}
        </AnimatePresence>

        <AnimatePresence>{stage === STAGES.INVITATION && <BackgroundMusic key="music" />}</AnimatePresence>
      </MusicProvider>
    </MotionConfig>
  );
}

import WeddingDetails from './WeddingDetails.jsx';
import Gallery from './Gallery.jsx';
import WeddingEvents from './WeddingEvents.jsx';
import Countdown from './Countdown.jsx';
import Location from './Location.jsx';
import RSVP from './RSVP.jsx';
import ClosingScreen from './ClosingScreen.jsx';
import { motion } from 'framer-motion';

/** Screens 3–8, presented as one scrolling story. */
export default function InvitationPage({ onReplayVideo }) {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
      <WeddingDetails onReplayVideo={onReplayVideo} />
      <Gallery />
      <WeddingEvents />
      <Countdown />
      <Location />
      <RSVP />
      <ClosingScreen />
    </motion.main>
  );
}

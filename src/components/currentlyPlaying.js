import React, { useContext, useRef } from 'react';
import Icon from './icon';
import PlayerContext from '../playerContext';
import { timeString } from '../formatters';
import { PLAYER_STATUSES, TRACKS } from '../constants';

export const CURRENTLY_PLAYING_HEIGHT = 50;

const ProgressBar = () => {
  const progressBarRef = useRef(null);
  const { elapsed, duration, setSeekingTo } = useContext(PlayerContext);

  const handleClick = e => {
    let clickedPercent = (e.clientX - progressBarRef.current.offsetLeft) / progressBarRef.current.offsetWidth;
    clickedPercent = Math.max(0, clickedPercent);
    clickedPercent = Math.min(1, clickedPercent);
    setSeekingTo(clickedPercent * duration);
  };

  return (
    <div className="progress-bar" ref={progressBarRef} onClick={handleClick}>
      <div className="progress-bg" />
      <div className="progress-fg" />
      <style jsx>
        {`
          .progress-bar {
            width: 470px;
            margin: 0 12px;
            padding: 8px 0;
            cursor: pointer;
          }
          .progress-bg {
            background-color: #ccc;
            width: 100%;
            height: 1px;
          }
          .progress-fg {
            background-color: orange;
            width: ${(elapsed / duration) * 100}%;
            height: 1px;
            margin-top: -1px;
          }
        `}
      </style>
    </div>
  );
};

const CurrentlyPlaying = () => {
  const { status, setStatus, trackUrl, elapsed, duration } = useContext(PlayerContext);

  const currentTrack = TRACKS.filter(track => track.url === trackUrl)[0];
  const isPlaying = status === PLAYER_STATUSES.PLAYING;

  return currentTrack ? (
    <div className="currently-playing">
      <div className="content">
        <div className="controls">
          <button
            onClick={() => setStatus(isPlaying ? PLAYER_STATUSES.PAUSED : PLAYER_STATUSES.PLAYING)}
          >
            <Icon type={isPlaying ? 'pause' : 'play'} />
          </button>
          {/* <button onClick={() => setStatus(PLAYER_STATUSES.STOPPED)}>
            <Icon type="stop" />
          </button> */}
        </div>
        <div className="progress-bar-wrapper">
          <span>{timeString(elapsed || 0)}</span>
          <ProgressBar />
          <span>{timeString(duration || 0)}</span>
        </div>
        <div className="details">
          <span className="artist">{currentTrack.artist}</span>
          <span className="song">{currentTrack.title}</span>
        </div>
      </div>
      <style jsx>{`
        .currently-playing {
          position: fixed;
          bottom: 0;
          height: ${CURRENTLY_PLAYING_HEIGHT}px;
          width: 100%;
          background: #141414;
        }
        .content {
          height: ${CURRENTLY_PLAYING_HEIGHT}px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .controls {
          margin: 0 1rem;
          width: 100px;
        }
        .controls button {
          border: none;
          outline: none;
          background: none;
          margin: 0 4px;
          padding: 0;
          cursor: pointer;
        }
        .progress-bar-wrapper {
          display: flex;
          align-items: center;
        }
        .details {
          width: 360px;
          display: flex;
          flex-direction: column;
        }
        .details .artist {
          color: #ccc;
          font-size: 80%;
        }
      `}</style>
    </div>
  ) : null;
};

export default CurrentlyPlaying;

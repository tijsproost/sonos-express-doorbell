import { SonosDevice } from '@svrooij/sonos/lib';

type Props = {
  sound?: string;
  localIP?: string;
  volume?: number;
  delayMs?: number;
  timeout?: number;
};

export const playNotification = ({
  sound,
  localIP,
  volume,
  delayMs,
  timeout,
}: Props): Promise<string> => {
  return new Promise((resolve, reject) => {
    (async () => {
      const sonos = new SonosDevice(localIP || '192.168.1.40');
      sonos
        .PlayNotification({
          trackUri:
            sound ||
            'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3', // Can be any uri sonos understands
          onlyWhenPlaying: false, // make sure that it only plays when you're listening to music. So it won't play when you're sleeping.
          timeout: timeout || 10, // If the events don't work (to see when it stops playing) or if you turned on a stream, it will revert back after this amount of seconds.
          volume: volume || 40, // Set the volume for the notification (and revert back afterwards)
          delayMs: delayMs || 700, // Pause between commands in ms, (when sonos fails to play notification often).
        })
        .then(played => {
          resolve(`Played notification(s): ${played}`);
          sonos.CancelEvents();
        })
        .catch(error => {
          reject(error);
        });
    })();
  });
};

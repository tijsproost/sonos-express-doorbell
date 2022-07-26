import * as NodeSonos from '@svrooij/sonos';
import { SonosDevice } from '@svrooij/sonos/lib';
import { forEach } from 'async';

const SonosManager = NodeSonos.SonosManager;

type Props = {
  sound?: string;
  localIP?: string;
  localIPs?: string[];
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
      console.log({
        sound,
        localIP,
        volume,
        delayMs,
        timeout,
      });
      if (localIP) {
        const sonos = new SonosDevice(localIP);
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
      } else {
        reject('no device ip given');
      }
    })();
  });
};

export const playNotificationOnMulitpleDevices = ({
  sound,
  localIPs,
  volume,
  delayMs,
  timeout,
}: Props): Promise<string> => {
  return new Promise((resolve, reject) => {
    (async () => {
      if (localIPs && localIPs.length > 0) {
        await forEach(localIPs, (ip, cb) => {
          const sonos = new SonosDevice(ip);
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
              cb();
              sonos.CancelEvents();
            })
            .catch(error => {
              cb();
            });
        });

        resolve('played');
      }
    })();
  });
};

export const playNotificationOnAllGroups = ({
  sound,
  volume,
  delayMs,
  timeout,
}: Props): Promise<string> => {
  return new Promise((resolve, reject) => {
    (async () => {
      const manager = new SonosManager();
      await manager.InitializeWithDiscovery(10);

      console.log(manager.Devices);
      manager
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
          manager.CheckAllEventSubscriptions();
        })
        .catch(error => {
          reject(error);
        });
    })();
  });
};

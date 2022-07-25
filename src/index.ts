import * as NodeSonos from '@svrooij/sonos';
import express from 'express';
import { playNotification } from './modules/playNotification';

const app = express();
const SonosManager = NodeSonos.SonosManager;
const manager = new SonosManager();
const port = parseInt(process.env.PORT || '3000', 10);

app.get('/', (req, res) => {
  try {
    manager
      .InitializeWithDiscovery(10)
      .then(console.log)
      .then(() => {
        // @ts-ignore
        const devices: string[] = [];
        manager.Devices.forEach(d => {
          devices.push(
            `Device ${d.Name} (${d.Uuid}) is joined in ${d.GroupName}`,
          );
        });

        res.send(devices);
      })
      .catch(console.error);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/playNotification', async (req, res) => {
  try {
    await playNotification({
      localIP: '192.168.1.40',
      sound: 'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3',
      volume: 70,
    });
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

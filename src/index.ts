import * as NodeSonos from '@svrooij/sonos';
import express from 'express';
import {
  playNotification,
  playNotificationOnAllGroups,
  playNotificationOnMulitpleDevices,
} from './modules/playNotification';

const app = express();
app.use(express.json()); //body parser
const SonosManager = NodeSonos.SonosManager;
const manager = new SonosManager();
const port = parseInt(process.env.PORT || '3000', 10);

app.get('/', (req, res) => {
  try {
    manager
      .InitializeWithDiscovery(10)
      .then(console.log)
      .then(() => {
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
  const { localIP, sound, volume } = req.body;
  try {
    const playedNotifications = await playNotification({
      localIP,
      sound,
      volume,
    });
    res.status(200).send(playedNotifications);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/playNotificationOnMultipleDevices', async (req, res) => {
  const { sound, volume, localIPs } = req.body;
  try {
    const playedNotifications = await playNotificationOnMulitpleDevices({
      sound,
      volume,
      localIPs,
    });
    res.status(200).send(playedNotifications);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/playNotificationOnAllDevices', async (req, res) => {
  const { sound, volume } = req.body;
  try {
    const playedNotifications = await playNotificationOnAllGroups({
      sound,
      volume,
    });
    res.status(200).send(playedNotifications);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

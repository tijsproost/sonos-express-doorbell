import * as NodeSonos from '@svrooij/sonos';
import express from 'express';
import { playNotification } from './modules/playNotification';

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
  const {localIP, sound, volume} = req.body;
  try {
    await playNotification({
      localIP,
      sound,
      volume,
    });
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

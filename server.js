const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

const markerFile = path.join(__dirname, 'marker.json');

app.get('/api/marker', (req, res) => {
  fs.readFile(markerFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Fehler beim Lesen');
    res.send(data);
  });
});

app.post('/api/marker', (req, res) => {
  const newMarker = req.body;

  fs.readFile(markerFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Fehler beim Lesen');

    let markers = JSON.parse(data || '[]');
    markers.push(newMarker);

    fs.writeFile(markerFile, JSON.stringify(markers, null, 2), (err) => {
      if (err) return res.status(500).send('Fehler beim Schreiben');
      res.send({ status: 'ok', marker: newMarker });
    });
  });
});

// DELETE: Marker anhand einer ID löschen
app.delete('/api/marker/:id', (req, res) => {
  const markerId = req.params.id;

  fs.readFile(markerFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Fehler beim Lesen');

    let markers = JSON.parse(data || '[]');
    const updatedMarkers = markers.filter(m => m.id !== String(markerId));

    fs.writeFile(markerFile, JSON.stringify(updatedMarkers, null, 2), (err) => {
      if (err) return res.status(500).send('Fehler beim Schreiben');
      res.send({ status: 'deleted', id: markerId });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

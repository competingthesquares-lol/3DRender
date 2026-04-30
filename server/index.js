const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const path = require('path');
app.use(cors());
app.use(express.static(path.join(__dirname, '../3DRender/dist'))); // 'build' if using CRA
app.get('/api/message', (req, res) => {
    res.json({message: "Hello from Express!"});
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../3DRender/dist/index.html'));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../3DRender/dist')));

mongoose.connect('mongodb://127.0.0.1:27017/simple_api')
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => {
        console.error('Could not connect to MongoDB. Is your MongoDB service running?');
        console.error(err.message);
    });

const pointSchema = new mongoose.Schema({
    x: Number, y: Number, z: Number
});

const polygonSchema = new mongoose.Schema({
    p: [Number],
    color: String
});

const componentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    points: [pointSchema],
    polygons: [polygonSchema]
});

const Component3D = mongoose.model('Component3D', componentSchema);


app.post('/api/components', async (req, res) => {
    try {
        const newComponent = new Component3D(req.body);
        const savedComponent = await newComponent.save();
        res.status(201).json(savedComponent);
    } catch (err) {
        console.error("POST Error:", err);
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/components', async (req, res) => {
    try {
        const components = await Component3D.find();
        res.json(components);
    } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/components/:id', async (req, res) => {
    try {
        const updatedComponent = await Component3D.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedComponent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/components/:id', async (req, res) => {
    try {
        await Component3D.findByIdAndDelete(req.params.id);
        res.json({ message: "Component deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../3DRender/dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

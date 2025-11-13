const express = require('express');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const { exec } = require('child_process');

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});

app.post('/zip-folder', async (req, res) => {
    const { sourceFolder, zipPath } = req.body;

    if (!sourceFolder || !zipPath) {
        return res.status(400).json({ error: 'Source folder and zip path are required.' });
    }

    try {
        // Ensure source folder exists
        if (!fs.existsSync(sourceFolder)) {
            return res.status(404).json({ error: 'Source folder not found.' });
        }
        if (fs.existsSync(sourceFolder + ".zip")) {
            return res.status(200).json({ message: 'Zip file exists.'})
        }
        // Create write stream for zip file
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Created zip: ${zipPath} (${archive.pointer()} bytes)`);
            res.status(200).json({ message: 'Folder zipped successfully.', size: archive.pointer() });
        });

        output.on('error', (err) => {
            console.error('Write stream error:', err);
            res.status(500).json({ error: 'Failed to create zip file.' });
        });

        archive.pipe(output);
        archive.directory(sourceFolder, false); // 'false' means no parent folder in the zip
        await archive.finalize();

    } catch (error) {
        console.error('Zipping error:', error);
        res.status(500).json({ error: 'Failed to zip folder.' });
    }
});

app.post('/invoke-script', async (req, res ) => {
    const {shellScript, envVar } = req.body;
    if (!shellScript){
        return res.status(400).json({ error: 'Missing shellScript'});
    }
    exec("./" + shellScript, {
        env: {
            ...process.env,
            ...(envVar || {}) 
        }
    }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                error: error.message,
                stderr: stderr || '',
                stdout: stdout || ''
            });
        }
        return res.status(200).json({ stdout, stderr });
    });
});
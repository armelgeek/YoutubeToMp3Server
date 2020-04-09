const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const YoutubeMp3Downloader = require("./utils/youtubeMp3Downloader/YoutubeMp3Downloader");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('mp3'));

app.get('/request', (req, res) => {
  var dir = `./mp3/${req.query.name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
  }
  var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "./ffmpeg/bin/ffmpeg.exe",      // Where is the FFmpeg binary located?
    "outputPath": `./mp3/${req.query.name}`,      // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",             // What video quality should be used?
    "queueParallelism": 2,                        // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                       // How long should be the interval of the progress reports
  });

  //Download video and save as MP3 file
  YD.download(req.query.videoId);

  YD.on("finished", function (err, data) {
    res.send({
      success: true,
    });
    console.log(JSON.stringify(data));
  });

  YD.on("error", function (error) {
    res.send({
      success: false,
      message: `Error: ${error}`,
    });
    console.log(error);
  });

  YD.on("progress", function (progress) {
    console.log(JSON.stringify(progress));
  });
})



app.listen(port, () => console.log("Youtube To Mp3 listening on port", port));
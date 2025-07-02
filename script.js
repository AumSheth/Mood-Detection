
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const moodDiv = document.getElementById("mood");
const detectBtn = document.getElementById("detectBtn");

async function loadModels() {
  const MODEL_URL = "./models";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  console.log("Models loaded");
  startVideo();
}

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.onloadeddata = () => {
        detectBtn.disabled = false;
        console.log("Camera ready");
      };
    })
    .catch((err) => {
      alert("Camera access denied or not available.");
      console.error(err);
    });
}

async function detectMood() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detection && detection.expressions) {
    const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
    const topMood = sorted[0][0];
    moodDiv.textContent = `Mood: ${topMood.toUpperCase()}`;
  } else {
    moodDiv.textContent = "Mood: No face detected";
  }
}

detectBtn.onclick = detectMood;

loadModels();

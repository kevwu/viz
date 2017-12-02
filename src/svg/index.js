import * as d3 from "d3"

const audio = new Audio()
audio.src = "/mp3/audio.mp3"

const audioCtx = new window.AudioContext()
const analyser = audioCtx.createAnalyser()
const source = audioCtx.createMediaElementSource(audio)

source.connect(audioCtx.destination)
source.connect(analyser)

audio.play()

const canvas = document.getElementById('canvas')
const canvasCtx = canvas.getContext('2d')
canvasCtx.canvas.width = window.innerWidth - 5;
canvasCtx.canvas.height = window.innerHeight - 5;

function animate() {
	requestAnimationFrame(animate)
	canvasCtx.clearRect(0,0,canvasCtx.canvas.width, canvasCtx.canvas.height)
	const freqValues = new Uint8Array(analyser.frequencyBinCount)
	analyser.getByteFrequencyData(freqValues)
	
	canvasCtx.beginPath()
	canvasCtx.lineJoin = "round"
	canvasCtx.lineWidth = 2;
	canvasCtx.strokeStyle = "black";
	canvasCtx.moveTo(0, canvasCtx.canvas.height/2);

	for(let i = 0; i < freqValues.length; i += 1) {
		canvasCtx.lineTo((i / freqValues.length) * canvasCtx.canvas.width, (canvasCtx.canvas.height / 2) - freqValues[i])
	}

	canvasCtx.stroke();

	const tdValues = new Uint8Array(analyser.frequencyBinCount)
	analyser.getByteTimeDomainData(tdValues)

	canvasCtx.beginPath()
	canvasCtx.lineJoin = "round"
	canvasCtx.lineWidth = 2
	canvasCtx.strokeStyle = "red"
	canvasCtx.moveTo(0, canvasCtx.canvas.height / 2)

	for(let i = 0; i < tdValues.length; i += 1) {
		canvasCtx.lineTo((i / tdValues.length) * canvasCtx.canvas.width, (canvasCtx.canvas.height / 2) - tdValues[i])
	}

	canvasCtx.stroke();
}

animate()


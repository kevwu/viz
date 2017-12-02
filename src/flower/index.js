/*
I had to go into my three.js installation in node_modules and remove the definition of
CanvasRenderer and Projector (they're just stubs that tell you the real function has
been moved to the examples folder.)

This is probably not the proper way to do it, but it's the only way I got it to work.

See also: https://github.com/mrdoob/three.js/issues/9562
 */
import "./SpriteCanvasMaterial"
import "./CanvasRenderer"
import "./Projector"
import * as THREE from "three"

/**
 * @author mrdoob / http://mrdoob.com/
 * @author soniaboller / https://soniaboller.github.io/
 */

// audioLoader

const app = {}
var source;
var buffer;
var analyser;

window.onload = function () {
	scene = new THREE.Scene();
	let width = window.innerWidth;
	let height = window.innerHeight;

	const fov = 20;

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
	camera.position.set(0, 0, 175);

	renderer.setClearColor(0x000000, 1);

	const PI2 = Math.PI * 2;
	particles = [];

	for (let i = 0; i <=2048; i++) {
		const material = new THREE.SpriteCanvasMaterial({
			color: 0xffffff,
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.33, 0, PI2);
				context.fill();
			}
		});
		particle = particles[i++] = new THREE.Sprite(material);
		scene.add(particle);
	}

	function windowResize (){
		width = window.innerWidth;
		height = window.innerHeight;
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}

	function onKeyDown(e) {
		switch (e.which) {
			case 32:
				if (app.play) {
					app.audio.pause();
					app.play = false;
				} else {
					app.audio.play();
					app.play = true;
				}
				break;
			case 82:
				flowerProperties.toggleRed = !flowerProperties.toggleRed;
				break;
			case 71:
				flowerProperties.toggleGreen = !flowerProperties.toggleGreen;
				break;
			case 66:
				flowerProperties.toggleBlue = !flowerProperties.toggleBlue;
				break;
			case 65:
				flowerProperties.animate = !flowerProperties.animate;
				break;
			case 187:
				if (flowerProperties.intensity < 1){
					flowerProperties.intensity += 0.01;
				}
				break;
			case 189:
				if (flowerProperties.intensity > 0.05){
					flowerProperties.intensity -= 0.01;
				}
		}
		return false;
	}

	function onDocumentTouchStart(e) {
		if (e.touches.length === 1) {
			e.preventDefault();
			mouseX = e.touches[0].pageX - windowHalfX;
			mouseY = e.touches[0].pageY - windowHalfY;
		}
	}

	function onDocumentTouchMove(e) {
		if (e.touches.length === 1) {
			e.preventDefault();
			mouseX = e.touches[0].pageX - windowHalfX;
			mouseY = e.touches[0].pageY - windowHalfY;
		}
	}

	window.addEventListener('resize', windowResize, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);
	document.addEventListener('keydown', onKeyDown, false);
	window.addEventListener('drop', onDrop, false);
	window.addEventListener('dragover', onDrag, false);

	function onDrag(e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	}

	function onDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		var droppedFiles = e.dataTransfer.files;
		app.audio.src = URL.createObjectURL(droppedFiles[0]); // sets the audio source to the dropped file
		// app.audio.autoplay = true;
		app.audio.play();
		app.play = true;
	}

	app.animate();
};

app.audio = new Audio()
document.body.appendChild(app.audio);
app.ctx = new (window.AudioContext || window.webkitAudioContext)(); // creates audioNode
app.audio.src = "/mp3/audio.mp3"
source = app.ctx.createMediaElementSource(app.audio); // creates audio source
analyser = app.ctx.createAnalyser(); // creates analyserNode
source.connect(app.ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode

app.audio.play()
app.play = true;

app.animate = animate;
app.animateParticles = animateParticles;

let mouseX = 0, mouseY = 0,
	windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

let camera, scene, renderer;

const flowerProperties = {}

flowerProperties.toggleRed = true;
flowerProperties.toggleGreen = false;
flowerProperties.toggleBlue = false;
flowerProperties.R = 0.7;
flowerProperties.G = 0;
flowerProperties.B = 0.7;
flowerProperties.radius = 50;
flowerProperties.a = 0.15;
flowerProperties.b = 0.20;
flowerProperties.angle = 11;
flowerProperties.aWavy = 1.20;
flowerProperties.bWavy = 0.76;
flowerProperties.wavyAngle = 2.44;
flowerProperties.aFlower = 25;
flowerProperties.bFlower = 0;
flowerProperties.flowerAngle = 2.86;
flowerProperties.spiral = false;
flowerProperties.wavySpiral = false;
flowerProperties.flower = true;
flowerProperties.circle = false;
flowerProperties.animate = true;

flowerProperties.intensity = 0.20 // [0.05, 1]
flowerProperties.fov = 35 // [1, 150]

function animate() {
	app.animationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame)(app.animate);
	// stats.begin();
	animateParticles();

	if(app.flowerCounter) {
		flowerProperties.flowerAngle += 0.0000004;
		if(flowerProperties.flowerAngle >= 2.87) {
			app.flowerCounter = false;
		}
	}
	else {
		flowerProperties.flowerAngle -= 0.0000004;
		if(flowerProperties.flowerAngle <= 2.85) {
			app.flowerCounter = true;
		}
	}
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
	// stats.end();
}

const uint8 = new Uint8Array(2048);
AnalyserNode.prototype.getFloatTimeDomainData = function(array) {
	this.getByteTimeDomainData(uint8);
	for (var i = 0, imax = array.length; i < imax; i++) {
		array[i] = (uint8[i] - 128) * 0.0078125;
	}
};

var particle;
var particles;

function animateParticles(){
	// Fast Fourier Transform (FFT) used to determine waveform
	const timeFrequencyData = new Uint8Array(analyser.fftSize);
	const timeFloatData = new Float32Array(analyser.fftSize);
	analyser.getByteTimeDomainData(timeFrequencyData);
	analyser.getFloatTimeDomainData(timeFloatData);
	for (let j = 0; j <= particles.length; j++){
		particle = particles[j++];
		let R, G, B

		R = flowerProperties.R + (timeFloatData[j]);
		G = flowerProperties.G + (timeFloatData[j]);
		B = flowerProperties.B + (timeFloatData[j]);

		if (flowerProperties.toggleRed){
			R = flowerProperties.R - (timeFloatData[j]);
		}
		else if (flowerProperties.toggleGreen){
			// forces green by adding the timeFloatData rather than subtracting
			G = flowerProperties.G - (timeFloatData[j]);
		}
		else if (flowerProperties.toggleBlue){
			// forces blue by adding  the timeFloatData rather than subtracting
			B = flowerProperties.B - (timeFloatData[j]);
		}

		particle.material.color.setRGB(R, G, B);

		// Archimedean Wavy Spiral with opposite sin and cos to generate crossover in flower pattern
		particle.position.x = (flowerProperties.aFlower + flowerProperties.bFlower * ((flowerProperties.flowerAngle / 100) * j))
			* Math.cos(( (flowerProperties.flowerAngle / 100) * j))
			+ Math.sin(j / (flowerProperties.flowerAngle / 100)) * 17;
		particle.position.y = (flowerProperties.aFlower + flowerProperties.bFlower * ((flowerProperties.flowerAngle / 100) * j))
			* Math.sin(( (flowerProperties.flowerAngle / 100) * j))
			+ Math.cos(j / (flowerProperties.flowerAngle / 100)) * 17;
		particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * flowerProperties.intensity);
		camera.position.y = 0;
	}

	camera.fov = flowerProperties.fov;
	camera.updateProjectionMatrix();
}

app.flowerCounter = true;

console.log("'1' '2' '3' '4' toggle visualizers \n'R' 'G' 'B' toggle colors \n'A' toggles animation \n'SPACE' toggles playback \n'h' toggles extra controls");
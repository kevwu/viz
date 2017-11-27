import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	SphereGeometry,
	Mesh,
	MeshDepthMaterial,
	MeshLambertMaterial,
	MeshNormalMaterial,
	MeshToonMaterial,
	AmbientLight,
	PointLight,
} from "three"
const audioSrc = "/mp3/audio.mp3"

let audio = new Audio
audio.src = audioSrc
audio.play()

let analyser = require("web-audio-analyser")(audio)
console.log(analyser.waveform())

let scene = new Scene()
let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

let renderer = new WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const NUM_SPHERES = 128
let spheres = []
for(let i = 0; i < NUM_SPHERES; i += 1) {
	spheres[i] = new Mesh(new SphereGeometry(0.5, 32, 32), new MeshLambertMaterial())

	spheres[i].position.x = Math.cos(((i+1)/NUM_SPHERES) * 2 * Math.PI) * 25
	spheres[i].position.y = Math.sin(((i+1)/NUM_SPHERES) * 2 * Math.PI) * 25

	scene.add(spheres[i])
}

camera.position.z = 40

let light = new PointLight(0xffffff)

// let lightSource = new Mesh(new SphereGeometry(0.5, 16, 8), new MeshToonMaterial())
// light.add(lightSource)
light.position.set(0,0,0)

scene.add(light)

function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)

	// light.position.z = Math.sin(Date.now()*0.005)
	// light.position.y = Math.sin(Date.now()*0.005)

	let freqs = analyser.frequencies()

	for(let i = 0; i < 1024; i += 1) {
		spheres[i].scale.x =  freqs[i + 10] / 8
		spheres[i].scale.y =  spheres[i].scale.x
	}
}
animate()

window.addEventListener("wheel", (event) => {
	if(event.deltaY > 0) {
		camera.position.z += 1
	} else if(event.deltaY < 0) {
		camera.position.z -= 1
	}
})
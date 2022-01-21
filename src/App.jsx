import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import aesthete from './pics/aesthete.jpg'
import mmmuggers from './pics/mmmuggers.mp3'
import dogsprite from './pics/dogsprite.png'

function App() {

useEffect(()=>{
 
  const scene = new THREE.Scene
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  document.body.appendChild( renderer.domElement)
 
  const texture = new THREE.TextureLoader().load(aesthete)
  scene.background = texture


  const ambientLight = new THREE.AmbientLight(0xffffff)

  scene.add(ambientLight)

    const sphereMaterial = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x99ff66
    })
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 20000
    const position = new Float32Array(particlesCount * 3)
    for(let p = 0; p < particlesCount * 3; p++) {
      position[p] = (Math.random() - 0.5) * 50
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  
    const particlesMesh = new THREE.Points(particlesGeometry, sphereMaterial)
    particlesMesh.position.z = 5
    scene.add(particlesMesh)

    const cubeGeometry = new THREE.TorusKnotGeometry( 10, 3, 25, 16 )
    const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff32, wireframe: true} );
    const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.z = -50
    scene.add( cube );


    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const listener = new THREE.AudioListener
    
    camera.add( listener )
    const stream = mmmuggers

    const ctx = new AudioContext()
    let audio = document.querySelector('#song1')
    const audioSrc = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    
    audioSrc.connect(analyser)
    audioSrc.connect(ctx.destination)
    const frequencyData = new Uint8Array(analyser.frequencyBinCount)
  
    const playMusic = () => {
      ctx.resume().then(()=> console.log('playback started'))
        const mediaElement = new Audio( stream );
        mediaElement.play();
    }
    
    const sprite = new THREE.TextureLoader().load(dogsprite)

    const trailMaterial = new THREE.PointsMaterial({
      size: 0.6,
      color: 0xee7676,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.5,
      transparent: true
    })

    
    let trailGeometry = new THREE.BufferGeometry;
    const trailCount = 300
    const trailPosition = new Float32Array(trailCount * 3)
    for(let p = 0; p < trailCount * 3; p++) {
      trailPosition[p] = (Math.random() - 0.5) * 50
    }
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPosition, 3))
    const particleTrail = new THREE.Points(trailGeometry, trailMaterial)

    const trail = (event) => {
      event.preventDefault()
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
      mouse.y = ( event.clientY / window.innerHeight ) * 2 + 1
      particleTrail.position.x = mouse.x
      particleTrail.position.y = mouse.y
      particleTrail.position.z = 0
      scene.add(particleTrail)
      playMusic()
    }

    const onWindowResize = () => {
      renderer.setSize( window.innerWidth, window.innerHeight )
    }

    window.addEventListener('resize', onWindowResize )
    window.addEventListener('mousedown', trail, false) 
    window.addEventListener('pointerdown', trail, false)


    const render = () =>{
      raycaster.setFromCamera(mouse, camera)
      
      const intersects = raycaster.intersectObjects( scene.children )

      // for(let i=0; i < intersects.length; i++){
      //   intersects[i].object.material.color.set(0xff0000)
      // }
      
      analyser.getByteFrequencyData(frequencyData)

      renderer.render( scene, camera )

      }

    function animate() {
      requestAnimationFrame( animate )
      particlesMesh.rotation.z += 0.003
      particlesMesh.rotation.y += -0.003
      
      particleTrail.position.x += 0.009
      particleTrail.position.y += 0.009
      particleTrail.position.z += 0.0012
      particleTrail.rotation.z += 0.0002
      
      cube.rotation.z += 0.03
      cube.rotation.y += 0.03
      cube.rotation.z += 0.008

      

      render()
    }
  
    animate()

    alert('click or tap clouds once to start animation and play "mmmuggers suck", a song i made a couple of years ago')
},[])



  return (

  <audio id="song1" src={mmmuggers}></audio>

) 
}

export default App

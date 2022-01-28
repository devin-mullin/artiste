import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import gone from './pics/gone.png'
import aesthete from './pics/aesthete.jpg'
import mmmuggers from './pics/mmmuggers.mp3'
import dogsprite from './pics/dogsprite.png'
import myorb from './pics/myorb.png'

function App() {
 const ref = useRef(0)

useEffect(()=>{
 

//bones

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

// orbs to ponder
  const orb = new THREE.TextureLoader().load(myorb)
    const sphereMaterial = new THREE.PointsMaterial({
      size: 0.15,
      sizeAttenuation: true,
      map: orb,
      alphaTest: 0.5,
      transparent: true
    })
    sphereMaterial.color.setHSL( 1.0, 0.3, 0.7 )
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 2000
    const position = new Float32Array(particlesCount * 3)
    for(let p = 0; p < particlesCount * 3; p++) {
      position[p] = (Math.random() - 0.5) * 50
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  
    const particlesMesh = new THREE.Points(particlesGeometry, sphereMaterial)
    particlesMesh.position.z = 5
    scene.add(particlesMesh)

// pipe  
    const cubeGeometry = new THREE.TorusKnotGeometry( 10, 3, 25, 16 )
    const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff32, wireframe: true} );
    const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.z = 0
    cube.position.x 
    scene.add( cube );

  // text
    const goneMap = new THREE.TextureLoader().load(gone)
    const textGeometry = new THREE.BoxGeometry(10,10,10,10)
    const textMaterial = new THREE.MeshBasicMaterial( {
      map: goneMap
    })
    const goneText = new THREE.Mesh(textGeometry, textMaterial)
    

   

// audio
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
    const mediaElement = new Audio( stream );

    const playMusic = () => {
      ctx.resume().then(()=> console.log('playback started'))
        audio.play()
    }

    const pauseMusic = () =>{
      ctx.suspend().then(()=> console.log('playback paused'))
        audio.pause()
    }

// dog trail
    const sprite = new THREE.TextureLoader().load(dogsprite)

    const trailMaterial = new THREE.PointsMaterial({
      size: 0.9,
      color: 0xee7676,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.5,
      transparent: true
    })

    
    let trailGeometry = new THREE.BufferGeometry;
    const trailCount = 3000
    const trailPosition = new Float32Array(trailCount * 3)
    for(let p = 0; p < trailCount * 3; p++) {
      trailPosition[p] = (Math.random() - 0.5) * 50
    }
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPosition, 3))
    const particleTrail = new THREE.Points(trailGeometry, trailMaterial)

    const trail = (event) => {
      if(ref.current === 0) {
      scene.remove(goneText)
      cube.position.z = 0 
      raycaster.setFromCamera(mouse, camera)
      let isInterSected = raycaster.intersectObject( cube )
      if(isInterSected){
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
      mouse.y = ( event.clientY / window.innerHeight ) * 2 + 1
      particleTrail.position.x = mouse.x
      particleTrail.position.y = mouse.y
      particleTrail.position.z = 0
      scene.add(particleTrail)
      playMusic()
      ref.current++
      }
    } else if(ref.current === 1) {
      scene.remove(particleTrail)
      cube.position.x = 150
      goneText.position.x = -5
      goneText.position.z = 0
      scene.add(goneText)
      pauseMusic()
      ref.current--
      
    }
     
    }


// event handlers
    const onWindowResize = () => {
      renderer.setSize( window.innerWidth, window.innerHeight )
    }

    let mouseX = 0
    let mouseY = 0
    let windowHalfX = window.innerWidth / 8
    let windowHalfY = window.innerHeight / 8


    const onPointerMove = ( event ) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

    }

    const onTouchStart = () => {
      if(ref.current === 0){
      raycaster.setFromCamera(mouse, camera)
      let isInterSected = raycaster.intersectObject( cube )
      if(isInterSected){
        scene.add(particleTrail)
        playMusic()
        ref.current++
      }
    }
  }

    const onTouchMove = () => {
      particlesMesh.rotation.z += -0.0003
      particlesMesh.rotation.y += 0.0003
      
      particleTrail.position.x += -0.0009
      particleTrail.position.y += -0.0009
      particleTrail.position.z += -0.00012
      particleTrail.rotation.z += -0.00002
      
    } 

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    const dragControls = new DragControls([cube], camera, renderer.domElement)

    dragControls.addEventListener('dragstart', function (event) {
      orbitControls.enabled = false
      })

    dragControls.addEventListener('dragend', function (event) {
      orbitControls.enabled = true
      })

    window.addEventListener('resize', onWindowResize )
    window.addEventListener('mousedown', trail, false) 
    window.addEventListener('touchstart', onTouchStart, false)
    window.addEventListener('touchmove', onTouchMove, false)
    document.body.addEventListener( 'pointermove', onPointerMove )


// render and animate
    const render = () =>{
      raycaster.setFromCamera(mouse, camera)

      
      const time = Date.now() * 0.00005

      camera.position.x += ( mouseX - camera.position.x ) * 0.0005
      camera.position.y += ( mouseY - camera.position.y) * 0.0005

      camera.lookAt( scene.position )

      const h = ( 360 * (1.0 + time) % 360 ) / 360
      sphereMaterial.color.setHSL( h, 0.5, 0.5 )

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

      goneText.rotation.z += 0.03
      goneText.rotation.y = -0.03
      goneText.rotation.x - 0.03

      

      render()
    }
  
    animate()

    alert('click or tap clouds once to start animation and play "mmmuggers suck", a song i made a couple of years ago. move your mouse / scroll wheel / touchscreen around to travel through the orb cloud')
},[])



  return (

  <audio id="song1" src={mmmuggers}></audio>

) 
}

export default App

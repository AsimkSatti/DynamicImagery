import * as THREE from '/three.js-master/build/three.module.js';


//Holds image data and offset variable
var data;
var offset=1;
var imageHeight;
var imageWidth;


//Generates Image Once loaded
function imageGenerator(){

        var image = document.getElementById("SourceImage");
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
 
        var x = 0;
        var y = 0;
        canvas.width = image.width;
        canvas.height = image.height;

        imageHeight = image.height;
        imageWidth = image.width
        console.log(imageWidth);

        canvas.addEventListener('webglcontextlost', handleContextLost, false);

        context.drawImage(image, x, y);

        var imageData = context.getImageData(x, y, image.width, image.height);
        data = imageData.data;

        var counter=0
 
        // overwrite original image
        context.putImageData(imageData, x, y);
     
     }
      
function handleContextLost(event) {
   event.preventDefault();
   cancelRequestAnimationFrame(requestId);
}



//Global data and variables needed regarding point cloud


var Cloud = [];
var geometry = new THREE.BufferGeometry();
var scene, camera, renderer;

var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane, stats,
        geometry, particleCount,
        i, j, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles,partlce;


var colors = [];

var color = new THREE.Color();
var points;
var count=0;
var rotations=[];
var positions = [];
var didRenderImage=false;
var timesEntered=0;
var Processed=false;


init();
animate();

 

function init() {

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 6000;

        cameraZ = 2750;
        fogHex = 0xffffff; /* As black as your heart.   */
        fogDensity = 0.0001; /* So not terribly dense?  */

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;


        scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xffffff);
        // scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';


        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        scene.add(  light )
        // light.target = points;
        

 

        renderer = new THREE.WebGLRenderer();  
        renderer.setPixelRatio(window.devicePixelRatio); 
        renderer.setSize(WIDTH, HEIGHT); 

        container.appendChild(renderer.domElement); 
 

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);


    }

function CloudPostProcessing(){
  particleCount = 4025;  //the height required pick how much you want
         
        for (i = 0; i < particleCount; i+=2) {
                        //J is the width *2 as taken 2 steps
             for(j =0; j<3250; j+=2){


                // X is the height and Y is the width
                var x = Math.random()*0+ i-2000;
                var y =Math.random()*0+ j-1500;
                var z =Math.random()*2000-2000;
                // var z=0;



                 positions.push(x,y,z);
                 color.setRGB( 1,0,0);
                 colors.push( color.r, color.g, color.b );



                // geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

                  };

            }

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        geometry.setAttribute( 'rotation', new THREE.Float32BufferAttribute( rotations, 3 ) );

          
        var material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );
        points = new THREE.Points( geometry, material );

        scene.add( points );
        points.rotation.z=300;
        Processed=true;

}



function animate() {
        requestAnimationFrame(animate);
        render();
      
    }

    
function imageCasting(){

        for (var i = 0; i < 10000000; i+=3) {
            // BGR :: RGB
            colors[i+count]=(data[i+count +offset]/255);
            
            colors[i+1+count]=(data[i+1+count +offset]/255);
            colors[i+2+count]=(data[i+2+count +offset]/255);
 
            offset+=1;
   
         } 

          geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        //Increase offset for generation of image to be incremental
         offset=0;

}


function update(){
    var time = Date.now() * 0.00005;
    var pixAtATime=100;

    if(!Processed && (!imageWidth && !imageHeight)){
          CloudPostProcessing();
}
    if(data &&timesEntered<10){
        imageCasting();
        timesEntered+=1;
    }

    // camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.x += 1.5*(mouseX - camera.position.x) * 0.05;
    camera.position.y += 1.5*(-mouseY - camera.position.y) * 0.05;
     // camera.position.z +=  window.scrollY;
     // console.log(window.scrollY);
        // particles.position.z-=(mouseX - camera.position.x) * 0.05;

    camera.lookAt(scene.position);
    scene.children[1].position.z-=(mouseX - camera.position.x) * 0.05;
 
    for (i = 0; i < scene.children.length; i++) {
             // scene.children[i].scale.z+=((Math.sin(time)));
             // console.log(Math.sin(time));
             // scene.children[i].position.z+=1;
             var object = scene.children[i];    
        }

}



function render() {
        update();
        renderer.render(scene, camera);
    }

function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    // /*  Mobile 

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

function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


window.addEventListener('load', imageGenerator);
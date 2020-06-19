// Projects images to their html

var imageFolder="Images/"
var theImages=["arabianClouds.jpg","Desist.png","smallDesist.png","smallFutura.png","Mynation.png","smallCloak.png","smallGranada.png","smallSasukeSudan.png","smallCanopus.png","smallMidOcean.png","Skywalker.png","Crying.png","boatlife.png"]
var selected=[];
 
for (var i = 0; i < theImages.length; i++) {
    theImages[i]
    var element = document.getElementById(("item"+(i+1)).toString());
    element.style.backgroundImage= "url('"+imageFolder+theImages[i]+"')";
 
}



//Sets the Menu button

var menu = document.getElementById("iconmenu");
function toggleMenu(){
    var images = document.getElementById("imgHandler");
     if(images.style.display=="initial"){
         images.style.display="none";
          menu.src = "Images/iconmenu.png";

     }
     else{
        images.style.display="initial";
         menu.src = "Images/iconcross.png";
     }
}
menu.onclick=function(){
     toggleMenu();
 
}
 



//Holds image data and offset variable
var data;
var offset=1;
var imageHeight;
var imageWidth;
var preData=[];
var reProcess=false;
var image = document.getElementById("SourceImage");
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var imageLoaded=false;
var gradientColor;



 
//Creates and sets image on canvas
function imageGenerator(){
        data=[];
        var x = 0;
        var y = 0;
        canvas.width = image.width;
        canvas.height = image.height;

        imageHeight = image.height;
        imageWidth = image.width;

        context.drawImage(image, x, y);

        var imageData = context.getImageData(x, y, image.width, image.height);
        data = imageData.data;
        var counter=0
 
        // overwrite original image
        context.putImageData(imageData, x, y);
        scene.remove(points);
 
     }
      
function handleContextLost(event) {
   event.preventDefault();
   cancelRequestAnimationFrame(requestId);
}


image.addEventListener("load",function(){
        imageLoaded =true;
        });
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
var animation=true;

 

init();
animate();
 


//Creates the inital scene and viewing and browser format
function init() {


        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 9000;
        //Camera poisiont for mobile
        if( window.innerWidth<600){
             cameraZ = 4500;
        }
        else{
             cameraZ = 3000;
        }

         
        fogHex = 0xfaf9f6; /* As black as your heart.   */
        fogDensity = 0.00005; /* So not terribly dense?  */

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;


        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f7fa);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';


        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        scene.add(  light );
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
 
//Creates the point cloud after image has processed
function CloudPostProcessing(){
  positions=[];
  colors=[];
         
        for (i = 0; i < imageHeight*2; i+=2) {
                        //J is the width *2 as taken 2 steps

             for(j =0; j<(imageWidth*2); j+=2){


                // X is the height and Y is the width
                var x = Math.random()*0+ i-1750;
                var y =Math.random()*0+ j-1650;
                var z =Math.random()*300-200;
                // var z = 120;
                // var z=1;

                 positions.push(x,y,z);
                 color.setRGB( 0,0,0);
                 colors.push( color.r, color.g, color.b );

 
                  };

            }

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        // geometry.setAttribute( 'rotation', new THREE.Float32BufferAttribute( rotations, 3 ) );

          
        var material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );
        points = new THREE.Points( geometry, material );
        scene.add( points );
 
        points.rotation.z=300.02;
        Processed=true;
 

}
 


function animate() {
        requestAnimationFrame(animate);
        render();
      
    }

//Dynamically sts gradient color based on the projected image
function setGradient(){
    var r;
    var g;
    var b;
    var inc=0;
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];
    
    var sec = document.getElementById("NoneThree");

    r = (colors[0]*255).toString();
    g = (colors[1]*255).toString();
    b = (colors[2]*255).toString();
    for (var i = 0; i < prefixes.length; i++) {
        sec.style.background='linear-gradient(to right, rgba('+r+','+g+','+b+',0.2), rgba(255,0,0,0))';
        sec.style.background = prefixes[i]+'linear-gradient(270, rgba('+r+','+g+','+b+',0.4), rgba(255,0,0,0))';
    }

}   



//Detrming the luminance of a pixel
function DeterminingLuminance(R,G,B){
 // as per relative luminance in colometeric spaces
 // luminance =0.2126R+0.7152G+0.0722B.

    var luminance = 0.2126*R + 0.7512*G + 0.0722*B;
    return luminance/255;
}




//Casting image data to the pointCloud
function imageCasting(datpo){
        for (var i = 0; i < (imageWidth*imageHeight)*3; i+=3) {
            // BGR :: RGB
            colors[i+count]=(data[i+count +offset]/255);
            
            colors[i+1+count]=(data[i+1+count +offset]/255);
            colors[i+2+count]=(data[i+2+count +offset]/255);
 
            var lum = DeterminingLuminance(data[i+count+offset],data[i+1+count+offset],data[i+2+count+offset]);
            positions[i+2]+=10*lum+Math.random()*5;
           
            offset+=1;
            
   
         } 
         // start=true;

          geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
          geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
          points.scale.y=0.5;
          points.scale.x=0.5;
          points.scale.z=0.5;
          // geometry.attributes.color.needsUpdate = true;
        //Increase offset for generation of image to be incremental
         offset=0;

         setGradient();

        if(reProcess){
            reProcess=false;
        }
     
        
        

}
 
 var time;

function update(){
    time = Date.now() * 0.00005;
    var pixAtATime=100;
 
    if(reProcess){
        console.log("casting Again");
        imageCasting();
    }
    if(timesEntered<100){
        timesEntered+=1;
    }
      
    // camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.x += (4*(mouseX) - camera.position.x) * 0.05;
    camera.position.y += (4*(-mouseY) - camera.position.y) * 0.05;
 
    scene.children[0].position.z-=(mouseX - camera.position.x) * 0.05;
    camera.lookAt(scene.position);

 
   
    if(animation){
    for (i = 0; i < scene.children.length; i++) {
        if(scene.children[i] instanceof THREE.Points){
               
             var exp = scene.children[0].scale.z;

             if(scene.children[i].scale.z+(Math.sin(3*time))<1){
                
                scene.children[i].scale.z=0.5
             }
             else{
                       scene.children[i].scale.z+=(Math.sin(3*time));
                        
             }
             if(scene.children[i].scale.z+(Math.sin(3*time))<1){
                     scene.children[i].scale.y=1;

             }
             else{
                    scene.children[i].scale.y+=0.05*(Math.sin(3*time));
                    // scene.children[i].rotation.y+=(Math.sin(0.000000001*time));
             }
           if(scene.children[i].scale.x+(Math.sin(3*time))<1.5){
                     scene.children[i].scale.x=1;

             }
             else{
                    scene.children[i].scale.x+=0.05*(Math.sin(3*time));
                    // scene.children[i].rotation.y+=(Math.sin(0.000000001*time));
             }

       
        }
                
        }
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

//returieves the selected images fullname
function getimgName(item){
    console.log(item);
     var ImgName = document.getElementById(item.id).style.backgroundImage.slice(5,-2);
     Cloudwriter(ImgName);
}

//Goes through images and finds grabs image that was clicked
var listItems = document.querySelectorAll("ul li");
listItems.forEach(function(item) {
  item.onclick = function(e) { 
     getimgName(item);
    
  }
});

 //Deletes and repopulates scene with new point cloud;
function Cloudwriter(imgName){
   scene.remove(points);
    context.clearRect(0, 0, imageWidth, imageHeight);
     var img = document.getElementById("SourceImage");
     img.src = imgName;
     img.addEventListener("load",function(){
          
          imageGenerator();
          CloudPostProcessing();
          reProcess=true;

     })
     toggleMenu();

 
}


//Toggle animation and resetting of data point
var btn =document.getElementById("button");

btn.onclick = function(){
   stopAnimation();
}
var tempTime;
  
function stopAnimation(){
      if(animation){
          for (var i = 0; i < (imageWidth*imageHeight)*3; i+=3){
            positions[i+2]=-100;
         
            }
   
        points.scale.x=1;
        points.scale.z=0.5;
        points.scale.y=1;
        tempTime=time;
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        animation=false;
        btn.innerHTML="Start Fun";
        }
      else{
        // time=tempTime;
         for (var i = 0; i < (imageWidth*imageHeight)*3; i+=3){
            positions[i+2] = Math.random()*300-100;
            }
          imageCasting();

          animation=true;
          btn.innerHTML="Stop Fun";
        
        
      }

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

function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
 





window.onload=function(){
 


    getimgName(listItems[2]);
 
}
 
image.addEventListener('load', imageGenerator);

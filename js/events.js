var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
renderer.setSize(window.innerWidth, window.innerHeight);

var events = [
  "Bamboozled-01.svg",
  "Battleship-01.png",
  "Cicada-01.svg",
  "gambit-08.png",
  "hawk.png",
  "MysteryRoom-01.svg",
  "Negative Space-01.svg",
  "OC-01.svg"
].map(
  filename =>
    new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 250),
      new THREE.MeshFaceMaterial(
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(`images/${filename}`),
          side: THREE.DoubleSide
        })
      )
    )
);

// var events1 = [
//   // "Bamboozled-01.svg",
//   "Battleship-01.png",
//   // "Cicada-01.svg",
//   "gambit-08.png",
//   "hawk.png"
//   // "MysteryRoom-01.svg",
//   // "Negative Space-01.svg",
//   // "OC-01.svg"
// ].map(
//   filename =>
//     new THREE.Mesh(
//       new THREE.PlaneGeometry(3, 3, 3, 3),
//       new THREE.MeshFaceMaterial(
//         new THREE.MeshPhongMaterial({
//           shininess: 30,
//           map: new THREE.TextureLoader().load(`images/${filename}`),
//           side: THREE.DoubleSide
//         })
//       )
//     )
// );

// THREE.MeshPhongMaterial({
//     color: 0xffffff,
//     shading: THREE.FlatShading
//   });

var eventOffSet = 7;

events.forEach((e, i) => {
  e.position.z = -7;
  e.position.x = i * 25.5 + eventOffSet;
  e.position.y = 2.7;
  scene.add(e);
});

// events1.forEach((e, i) => {
//   e.position.z = -7;
//   e.position.x = i * 25.5 + 6;
//   scene.add(e);
// });

// var material = new THREE.MeshFaceMaterial(cubeMaterials);
// var cube = new THREE.Mesh(geometry, material);

var controls = new THREE.DeviceOrientationControls(camera);

// var light1 = new THREE.DirectionalLight(0xffffff, 1);
// var light2 = new THREE.SpotLight(0x02d040, 25);
// light1.position.set(0, 5, 0);
// light2.position.set(26, 26, 10);

// light1.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0040 })));
// scene.add(light1);
// scene.add(light2);

// camera.position.z = 10;

var ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);

var loader = new THREE.FontLoader();

var eventDescriptions = [
  `An implementation of a mad house involving mild
   brain teasers, puzzles and fun games. No time for
    maths and GK, it’s all about the fun.`,
  `An offline coding event where you code efficient
   algorithms to defeat the Syndicate at sea and keep
    them at bay.`,
  `Think you're a code-breaker? Test your skills with
   Cicada, an event with some of the most head 
   scratching puzzles you've ever seen. Rack your brains,
    first online and then offline in the final round.`,
  `A fast paced offline coding event where you bet on your
   coding skills, to rise to the top of the leaderboard.`,
  `A 3 day online scavenger hunt that'll test your problem
   solving skills to the extreme. It's crazy and highly
    addictive.`,
  `Mystery Room is a non tech event based on the
   quintessential Escape Room! Be it invisible ink or
    confusing riddles, deciphering the clues is the only
     way out!`,
  `A Graphic Designing competition providing an unparalleled
   opportunity for emerging designers to gain exposure and put
    their creative skills to the test.`,
  `A 3 day long nerve racking test of your competitive coding
   proficiency where you show off your skills against the top
    coders in the game`
].map(a => a + ' Two more lines of description goes here. asdjka lsdlaksdj aslkdj asldkja sldkjas dlkajsd ');

loader.load("fonts/helvetiker_regular.typeface.json", function(font) {
  var materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
  ];

  eventNames.forEach((eventname, i) => {
    var textGeometry = new THREE.TextGeometry(eventname, {
      font: font,
      size: 1,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: false
      // bevelThickness: 0.01,
      // bevelSize: 0.01,
      // bevelSegments: 5
    });

    var textGeo = new THREE.BufferGeometry().fromGeometry(textGeometry);
    var textMesh1 = new THREE.Mesh(textGeo, materials);
    textMesh1.rotation.y = 0.1;
    textMesh1.position.x = events[i].position.x - 16;
    textMesh1.position.y = events[i].position.y;
    textMesh1.position.z = events[i].position.z;
    scene.add(textMesh1);
  });
});

var lights = [];
lights[0] = new THREE.DirectionalLight(0xffffff, 1);
lights[0].position.set(1, 0, 1);
lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
lights[1].position.set(7.5, 10, 5);
lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
lights[2].position.set(-7.5, -10, 5);
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

events.forEach(event => {
  // event.rotation.x += 0.25;
  event.rotation.y -= 0.25;
});

// events1.forEach(event => {
//   // event.rotation.x += 0.25;
//   event.rotation.y -= 0.25;
// });

particle = new THREE.Object3D();
scene.add(particle);

var geometry = new THREE.TetrahedronGeometry(2, 0);

var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shading: THREE.FlatShading
});

for (var i = 0; i < 1000; i++) {
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position
    .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    .normalize();
  mesh.position.multiplyScalar(90 + Math.random() * 700);
  mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
  particle.add(mesh);
}

function animate() {
  TWEEN.update();
  requestAnimationFrame(animate);
  particle.rotation.x += 0.0002;
  particle.rotation.y += 0.0002;
  particle.children.forEach((child, i) => {
    child.rotation.x += (Math.random() / 100) * (i % 2 === 0 ? -1 : 1);
    child.rotation.y += (Math.random() / 100) * (i % 2 === 0 ? -1 : 1);
  });
  events.forEach(event => {
    // event.rotation.x += 0.001;
    // event.rotation.y += 0.01;
  });
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

onload = () => {
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
  // addEventListener('wheel', e => spin(e.deltaY > 0));
  addEventListener("keydown", e =>
    spin(
      e.keyCode === 39 || e.keyCode === 40
        ? true
        : e.keyCode === 37 || e.keyCode === 38
        ? false
        : null
    )
  );
  document.querySelector(".event-desc").innerHTML = eventDescriptions[currentEvent];
  document.querySelector(".event-name").innerHTML = eventNames[currentEvent];
  document.addEventListener("click", e => spin(e.x > window.innerWidth / 2));
};

var currentEvent = 0;

var currentDegree = 0;

var eventNames = [
  "BAMBOOZLED",
  "BATTLESHIP",
  "CICADA",
  "GAMBIT",
  "HAWKEYE",
  "MYSTERY ROOM",
  "NEGATIVE SPACE",
  "ONLINE CODING"
];

var spinnable = true;

function spin(invert) {
  // setTimeout(() => spinnable = true, 2000);
  if (invert === null || !spinnable) return;
  // spinnable = false;
  if (invert) {
    currentEvent = ++currentEvent % events.length;
    currentDegree = -45 * currentEvent;
  } else {
    currentEvent = --currentEvent % events.length;
    if (currentEvent < 0) currentEvent = events.length - 1;
    currentDegree = -45 * currentEvent;
  }
  document.querySelector(
    ".spinner"
  ).style.transform = `rotate(${currentDegree}deg)`;

  var position = camera.position;
  var target = {
    ...position,
    x: events[currentEvent].position.x - eventOffSet
  };

  new TWEEN.Tween(position)
    .to(target, 500)
    .onUpdate(function() {
      camera.position.x = position.x;
      camera.position.y = position.y;
      camera.position.z = position.z;
    })
    .start();
  document.querySelector(".event-name").innerHTML = eventNames[currentEvent];
  document.querySelector(".event-desc").classList.add('invisible');
  document.querySelector(".event-details").classList.add('invisible');
  document.querySelector(".event-desc").innerHTML = eventDescriptions[currentEvent];
  setTimeout(() => document.querySelector(".event-desc").classList.remove('invisible'), 200);
  setTimeout(() => document.querySelector(".event-details").classList.remove('invisible'), 250);
  // camera.lookAt(events[currentEvent].position);
}

// var renderer, scene, camera, composer, circle, skelet, particle;

// window.onload = function() {
//   init();
//   animate();
// }

// function init() {
//   renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//   renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.autoClear = false;
//   renderer.setClearColor(0x000000, 0.0);
//   document.getElementById('main').appendChild(renderer.domElement);

//   scene = new THREE.Scene();

//   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
//   camera.position.z = 400;
//   scene.add(camera);

//   circle = new THREE.Object3D();
//   skelet = new THREE.Object3D();
//   particle = new THREE.Object3D();

//   scene.add(circle);
//   scene.add(skelet);
//   scene.add(particle);

//   var geometry = new THREE.TetrahedronGeometry(2, 0);
//   var geom = new THREE.IcosahedronGeometry(7, 1);
//   var geom2 = new THREE.IcosahedronGeometry(15, 1);

//   var material = new THREE.MeshPhongMaterial({
//     color: 0xffffff,
//     shading: THREE.FlatShading
//   });

//   for (var i = 0; i < 1000; i++) {
//     var mesh = new THREE.Mesh(geometry, material);
//     mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
//     mesh.position.multiplyScalar(90 + (Math.random() * 700));
//     mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
//     particle.add(mesh);
//   }

//   var mat = new THREE.MeshPhongMaterial({
//     color: 0xffffff,
//     shading: THREE.FlatShading
//   });

//   var mat2 = new THREE.MeshPhongMaterial({
//     color: 0xffffff,
//     wireframe: true,
//     side: THREE.DoubleSide

//   });

//   var planet = new THREE.Mesh(geom, mat);
//   planet.scale.x = planet.scale.y = planet.scale.z = 16;
//   circle.add(planet);

//   var planet2 = new THREE.Mesh(geom2, mat2);
//   planet2.scale.x = planet2.scale.y = planet2.scale.z = 10;
//   skelet.add(planet2);

//   var ambientLight = new THREE.AmbientLight(0x999999 );
//   scene.add(ambientLight);

//   var lights = [];
// lights[0] = new THREE.DirectionalLight(0xffffff, 1);
// lights[0].position.set(1, 0, 0);
// lights[1] = new THREE.DirectionalLight(0x11E8BB, 1);
// lights[1].position.set(0.75, 1, 0.5);
// lights[2] = new THREE.DirectionalLight(0x8200C9, 1);
// lights[2].position.set(-0.75, -1, 0.5);
// scene.add(lights[0]);
// scene.add(lights[1]);
// scene.add(lights[2]);

//   window.addEventListener('resize', onWindowResize, false);

// };

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function animate() {
//   requestAnimationFrame(animate);

//   particle.rotation.x += 0.0000;
//   particle.rotation.y -= 0.0040;
//   circle.rotation.x -= 0.0020;
//   circle.rotation.y -= 0.0030;
//   skelet.rotation.x -= 0.0010;
//   skelet.rotation.y += 0.0020;
//   renderer.clear();

//   renderer.render(scene, camer )
// };

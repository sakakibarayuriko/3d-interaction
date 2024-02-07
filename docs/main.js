let earth;
let scene, camera, renderer;
const canvas = document.getElementById("bg");
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const text = document.querySelector(".text");
let isClicked = false;

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const init = () => {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.rotation.set(0, 0, 0);
  camera.position.set(0, 0, 50);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas.appendChild(renderer.domElement);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  scene.add(dirLight);

  const ambLight = new THREE.AmbientLight(0x333333);
  scene.add(ambLight);

  // 地球
  const geometry = new THREE.SphereBufferGeometry(10, 30, 30);
  geometry.scale(-1, 1, 1);
  const texture = new THREE.TextureLoader().load("https://threejs-earth.s3.ap-northeast-1.amazonaws.com/earth.jpeg");
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: texture,
  });
  earth = new THREE.Mesh(geometry, material);
  earth.position.x = -20;
  scene.add(earth);

  // ポイント
  const pointGeometry = new THREE.CircleGeometry(0.4, 30, 30);
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const point = new THREE.Mesh(pointGeometry, pointMaterial);
  point.position.x = -20;
  point.position.y = 5;
  point.userData = { name: "point" };
  scene.add(point);
  const pointGeometry2 = new THREE.CircleGeometry(0.8, 30, 30);
  const pointMaterial2 = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true});
  const point2 = new THREE.Mesh(pointGeometry2, pointMaterial2);
  point2.position.x = -20;
  point2.position.y = 5;
  point2.userData = { name: "point" };
  scene.add(point2);

  render();
  window.addEventListener('resize', onWindowResize, false);
};

const handleMouseMove = (event) => {
  const element = event.currentTarget;
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  const w = element.offsetWidth;
  const h = element.offsetHeight;

  mouse.x = ( x / w ) * 2 - 1;
  mouse.y = -( y / h ) * 2 + 1;
};

canvas.addEventListener('click', handleMouseMove);

const render = () => {
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0){
    if (intersects[0].object.userData.name === "point") {
      if (!isClicked) {
        text.innerHTML = "Qui voluptatum, architecto culpa odit, quis ea atque adipisci vero voluptate iure perferendis facilis eos possimus quos praesentium? Dignissimos.";
        const tl = gsap.timeline();
        tl.to(camera.position, { x: -12, z: 20, duration: 0.9, ease: Power3.easeOut });
        tl.fromTo(".text", { opacity: 0 }, { opacity: 1, duration: 0.9, ease: Power3.easeOut }, "<");
        isClicked = true;
        textSpan();
      } else {
        text.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, quas adipisci?";
        const tl = gsap.timeline();
        tl.to(camera.position, { x: 0, z: 50, duration: 0.9, ease: Power3.easeOut });
        tl.fromTo(".text", { opacity: 0 }, { opacity: 1, duration: 0.9, ease: Power3.easeOut }, "<");
        isClicked = false;
        textSpan();
      }
    }
  }
  requestAnimationFrame(render);
};

const textSpan = () => {
  const textElement = document.querySelector('.text');
  const chars = Array.from(textElement.textContent);
  textElement.innerHTML = chars.map(char => `<span>${char}</span>`).join('');
};

window.addEventListener("load", () => {
  init();
  textSpan();
});

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { OBJLoader } from "three/examples/jsm/Addons.js";

import floor1 from "../img/floor1.jpg";
import floor2 from "../img/floor2.jpg";
import floor3 from "../img/floor3.jpg";
import floor4 from "../img/floor4.jpg";
import floor5 from "../img/floor5.jpg";
import kabe from "../img/kabe.png";

const doorObj = new URL("../img/door2.obj", import.meta.url);
const doorObj3 = new URL("../img/door3.obj", import.meta.url);

//dosya işlemleri
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; //gölgeleri aktif ettik heralde
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); //sahne
const camera = new THREE.PerspectiveCamera( //kamera
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const orbit = new OrbitControls(camera, renderer.domElement);

//sahne
const axesHelper = new THREE.AxesHelper(5); //eksen yardımcısı
scene.add(axesHelper); //eksen yardımcısını sahneye ekleme
camera.position.set(-10, 30, 30);
orbit.update();
const boxGeometry = new THREE.BoxGeometry(); //geometri ayarlama
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); //görünümü ayarlama
const box = new THREE.Mesh(boxGeometry, boxMaterial); //mesh ile kutunun geometrisini ve görünümünü birleştiriyoruz
// scene.add(box); //kutuyu sahneye ekle
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
const sphereGeometry = new THREE.SphereGeometry(4); //küre ekleme
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);
sphere.position.set(-10, 10, 0);
// sphere.castShadow = true;
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight({ color: 0xffffff });
scene.add(directionalLight);
directionalLight.position.set(-30, 30, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -20;
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dLightHelper);
const dLightShadowHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
);
scene.add(dLightShadowHelper);
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.05);
renderer.setClearColor(0xf5f5dc);

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(floor1);

const doorGeometry = new THREE.BoxGeometry(10, 10, 10);
const doorMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: textureLoader.load(kabe),
});
const doorMultiMaterial = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load(kabe) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(kabe) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load() }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load() }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(kabe) }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(kabe) }),
];
const door = new THREE.Mesh(doorGeometry, doorMultiMaterial);
// scene.add(door);
door.position.y = 5.1;
door.castShadow = true;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientX / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const assetLoader = new OBJLoader();

const texture1 = textureLoader.load(floor1);

assetLoader.load(doorObj3, function (object) {
    object.scale.set(10, 8, 10);
    object.rotation.y = Math.PI * 45;
    // object.position.x = -5;
    scene.add(object);

    object.traverse(function (node) {
        console.log(node);
        if (node.isMesh) {
            // node.material[0].color.set(0xff0000);
            node.material[1].color.set(0xF5F5DC);
            node.material[2].color.set(0xF5F5DC);
            node.material[0].map = texture1;
            node.material.needsUpdate = true;
        }
    });
});

function animate(time) {
    //animasyon fonksiyonu
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    renderer.render(scene, camera); //render ediyos
}

renderer.setAnimationLoop(animate);

animate();

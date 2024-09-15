import {
  Mesh,
  Group,
  PointLight,
  TextureLoader,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";

export class Sun {
  private group = new Group();
  private loader = new TextureLoader();
  animate;
  private sunTexture = "/assets/sun-map.jpg";

  constructor() {
    this.addLighting();
    this.createSun();
    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createSun() {
    const map = this.loader.load(this.sunTexture);
    const sunGeometry = new IcosahedronGeometry(5, 12);
    const sunMaterial = new MeshBasicMaterial({
      map,
    });
    const sunMesh = new Mesh(sunGeometry, sunMaterial);
    this.group.add(sunMesh);

    this.group.userData.update = (t: number) => {
      this.group.rotation.y = -t / 5;
    };
  }

  addLighting() {
    const sunLight = new PointLight(0xffff99, 1000);
    sunLight.position.set(0, 0, 0);
    this.group.add(sunLight);
  }

  createAnimateFunction() {
    return (t = 0) => {
      const time = t * 0.00051;
      requestAnimationFrame(this.animate);
      this.group.userData.update(time);
    };
  }

  getSun() {
    return this.group;
  }
}

let Engine = Matter.Engine,  // Engine module for physics simulation
  World = Matter.World,  // World module for creating and managing bodies
  Bodies = Matter.Bodies,  // Bodies module for creating different types of bodies
  Body = Matter.Body,  // Body module for manipulating body properties
  Events = Matter.Events;  // Events module for handling events

let maxStretch = 100;  // Maximum stretch distance for the slingshot
let strength = 0.00161;  // Strength of the slingshot force
let simulationSpeed = 0.8;  // Simulation speed (1 is normal)
let interactRadius = 50;  // Radius within which mouse interaction is allowed

let boxes = [];  // Array to store game objects
let pumpkinReleased = false;  // Flag to track if the pumpkin has been released
let pumpkinHasCollided = false;  // Flag to track if the pumpkin has collided with any body
let pumpkinBeingDragged = false;  // Flag to track if the pumpkin is being dragged
let gameStarted = false;  // Flag to track if the game has started

function preload() {
  titleScreen = loadImage('./images/angry_pumpkins.jpg');  // Preload title screen image
  imgSkull = loadImage('./images/skull.png');  // Preload skull image
  pumpkinImg = loadImage('./images/angry2.png');  // Preload pumpkin image
  imgBoxSkull = loadImage('./images/box2.png');  // Preload box skull image
  imgStone1 = loadImage('./images/stone2.png');  // Preload stone image
  imgBone1 = loadImage('./images/bone1.png');  // Preload bone image
  imgPlank1 = loadImage('./images/plank1.png');  // Preload plank image
  monsterImg = loadImage('./images/monster.png');  // Preload monster image
}

function setup() {
  let canvas = createCanvas(1500, 800);

  engine = Engine.create(); // 创建物理引擎实例
  engine.timing.timeScale = simulationSpeed; // 设置物理模拟速度

  ground = Bodies.rectangle(width / 2, height - 100, width, 20, {
    isStatic: true
  }); // 创建地面刚体
  World.add(engine.world, ground); // 将地面刚体添加到物理世界中

  pumpkin = Bodies.circle(150, height - 200, 20, {
    isStatic: true
  }); // 创建南瓜刚体
  World.add(engine.world, pumpkin); // 将南瓜刚体添加到物理世界中

  slingshot = new SlingShot(150, height - 200, pumpkin); // 创建弹弓实例
  Events.on(engine, 'collisionStart', collision); // 监听碰撞事件

  torch1 = new Torch(330, 620); // 创建火炬1实例
  torch2 = new Torch(1250, 455); // 创建火炬2实例

  explosionManager = new ExplosionManager(); // 创建爆炸管理器实例

    // 初始化对象

    boxes.push(new GameObject(600, 650, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(600, 550, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(650, 600, 50, 50, monsterImg, 1.1, true, true)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(700, 650, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(700, 550, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(650, 480, 150, 25, imgPlank1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(650, 450, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(650, 380, 50, 50, monsterImg, 1.1, true, true)); // 添加一个游戏对象到数组中

    boxes.push(new GameObject(1100, 650, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(1170, 650, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(1135, 580, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(1135, 510, 50, 50, monsterImg, 1.1, true, true)); // 添加一个游戏对象到数组中

    boxes.push(new GameObject(450, 650, 150, 25, imgPlank1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(450, 620, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(450, 550, 20, 70, imgStone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(450, 490, 50, 50, monsterImg, 1.1, true, true)); // 添加一个游戏对象到数组中


    boxes.push(new GameObject(800, 650, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(800, 550, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(900, 650, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(900, 550, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中

    boxes.push(new GameObject(850, 650, 30, 100, imgBone1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(850, 600, 50, 50, monsterImg, 1.1, true, true)); // 添加一个游戏对象到数组中

    boxes.push(new GameObject(850, 480, 150, 25, imgPlank1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(850, 450, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new OvalObject(850, 410, 48, 56, imgSkull, 1.2)); // 添加一个椭圆对象到数组中
    boxes.push(new OvalObject(850, 410, 48, 56, imgSkull, 1.2)); // 添加一个椭圆对象到数组中

    boxes.push(new GameObject(850, 360, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中

    boxes.push(new GameObject(850, 220, 150, 25, imgPlank1, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(850, 190, 70, 70, imgBoxSkull, 1.05)); // 添加一个游戏对象到数组中
    boxes.push(new GameObject(850, 120, 50, 50, monsterImg, 1.1, true, true)); // 添加一个游戏对象到数组中
  }

  class ExplosionManager {
    constructor() {
      this.explosions = [];
    }

    createExplosion(x, y) {
      let explosion = new Explosion(x, y);
      this.explosions.push(explosion);
    }

    updateAndDisplay() {
      for (let i = this.explosions.length - 1; i >= 0; i--) {
        this.explosions[i].update();
        this.explosions[i].display();
        if (this.explosions[i].isDead()) {
          this.explosions.splice(i, 1);
        }
      }
    }
  }

  class Explosion {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.particles = [];
      for (let i = 0; i < 50; i++) {
        this.particles.push(new ExplosionParticle(this.pos.x, this.pos.y));
      }
    }

    update() {
      for (let particle of this.particles) {
        particle.update();
      }
    }

    display() {
      for (let particle of this.particles) {
        particle.display();
      }
    }

    isDead() {
      return this.particles.every(particle => particle.isDead());
    }
  }


  class ExplosionParticle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D().mult(random(1, 3)); // 随机速度和方向
      this.lifespan = 255;
      this.size = random(3, 10);
    }

  update() {
    this.vel.mult(0.95); // Decelerate
    this.pos.add(this.vel);
    this.lifespan -= 5;
  }

  display() {
    noStroke();
    fill(255, this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

function resetpumpkin() {

  // Portal effect
  let disappearPortal = new PortalEffect(pumpkin.position.x, pumpkin.position.y);
  explosionManager.explosions.push(disappearPortal);

  // Delete pumpkin
  World.remove(engine.world, pumpkin);

  // Create new pumpkin
  pumpkin = Bodies.circle(150, height - 200, 20, {
    isStatic: true
  });
  World.add(engine.world, pumpkin);

  // Portal effect
  let appearPortal = new PortalEffect(pumpkin.position.x, pumpkin.position.y);
  explosionManager.explosions.push(appearPortal);

  // Reset Decelerate
  slingshot = new SlingShot(150, height - 200, pumpkin);
  // 重置状态
  pumpkinReleased = false; // 是否释放南瓜
  pumpkinHasCollided = false; // 南瓜是否发生碰撞
  pumpkinBeingDragged = false; // 是否正在拖动南瓜
  }

  function mouseDragged() {
    let d = dist(mouseX, mouseY, pumpkin.position.x, pumpkin.position.y); // 计算鼠标位置与南瓜位置的距离
    if (!pumpkinReleased && d < interactRadius) { // 如果南瓜未释放且距离小于交互半径
      pumpkinBeingDragged = true; // 设置南瓜正在被拖动
      let stretchDistance = dist(mouseX, mouseY, slingshot.origin.x, slingshot.origin.y); // 计算鼠标位置与弹弓起点的距离
      if (stretchDistance > maxStretch) { // 如果拉伸距离大于最大拉伸距离
        // 计算起点与鼠标之间的角度
        let angle = atan2(mouseY - slingshot.origin.y, mouseX - slingshot.origin.x);
        // 计算南瓜在最大距离限制下的位置
        let newPosX = slingshot.origin.x + maxStretch * cos(angle);
        let newPosY = slingshot.origin.y + maxStretch * sin(angle);
        Body.setPosition(pumpkin, {
          x: newPosX,
          y: newPosY
        });
      } else {
        Body.setPosition(pumpkin, {
          x: mouseX,
          y: mouseY
        });
      }
    }
  }


  function mousePressed() {
    if (!gameStarted) { // 如果游戏未开始
      gameStarted = true; // 设置游戏开始
    } else {
      if (keyIsPressed && (key === 'q' || key === 'Q')) { // 如果按下了键盘上的 'q' 或 'Q'
        let box = new GameObject(mouseX, mouseY, 70, 70, imgBoxSkull, 1.05); // 创建一个方形游戏对象
        boxes.push(box); // 将游戏对象添加到数组中
      }

      if (keyIsPressed && (key === 'w' || key === 'W')) { // 如果按下了键盘上的 'w' 或 'W'
        let box = new GameObject(mouseX, mouseY, 20, 70, imgStone1, 1.05); // 创建一个方形游戏对象
        boxes.push(box); // 将游戏对象添加到数组中
      }

      if (keyIsPressed && (key === 'e' || key === 'E')) { // 如果按下了键盘上的 'e' 或 'E'
        let box = new GameObject(mouseX, mouseY, 30, 100, imgBone1, 1.05); // 创建一个方形游戏对象
        boxes.push(box); // 将游戏对象添加到数组中
      }

      if (keyIsPressed && (key === 'r' || key === 'R')) { // 如果按下了键盘上的 'r' 或 'R'
        let box = new GameObject(mouseX, mouseY, 150, 25, imgPlank1, 1.05); // 创建一个方形游戏对象
        boxes.push(box); // 将游戏对象添加到数组中
      }

      if (keyIsPressed && (key === 't' || key === 'T')) { // 如果按下了键盘上的 't' 或 'T'
        let oval = new OvalObject(mouseX, mouseY, 48, 56, imgSkull, 1.2); // 创建一个椭圆形游戏对象
        boxes.push(oval); // 将游戏对象添加到数组中
      }

      if (keyIsPressed && (key === 'm' || key === 'M')) { // 如果按下了键盘上的 'm' 或 'M'
        let monster = new GameObject(mouseX, mouseY, 50, 50, monsterImg, 1.1, true, true); // 创建一个怪物游戏对象
        boxes.push(monster); // 将游戏对象添加到数组中
      }
    }
  }

  function keyPressed() {
    // 重置南瓜位置
    if (key === ' ') { // 如果按下了空格键
      resetpumpkin(); // 重置南瓜位置
    }

    // 清除所有对象
    if (key === 'Enter') { // 如果按下了回车键
      for (let i = 0; i < boxes.length; i++) {
        World.remove(engine.world, boxes[i].body); // 从物理引擎中移除游戏对象
      }
      boxes = []; // 清空游戏对象数组
    }
  }

  function mouseReleased() {
    if (pumpkinBeingDragged) { // 如果南瓜正在被拖动
      pumpkinBeingDragged = false; // 重置拖动标志
      pumpkinReleased = true; // 设置南瓜已释放
      Body.setStatic(pumpkin, false); // 设置南瓜为非静态
      let forceX = slingshot.origin.x - pumpkin.position.x; // 计算施加力的 x 分量
      let forceY = slingshot.origin.y - pumpkin.position.y; // 计算施加力的 y 分量
      Body.applyForce(pumpkin, pumpkin.position, {
        x: forceX * strength,
        y: forceY * strength
      }); // 施加力到南瓜
    }
  }

  function draw() {
    if (!gameStarted) { // 如果游戏未开始
      image(titleScreen, 0, 0, width, height); // 绘制标题画面

    } else {
      clear(); // 清空画布

      Engine.update(engine); // 更新物理引擎

      explosionManager.updateAndDisplay(); // 更新和显示爆炸效果

      // 检查南瓜是否在发射后停止运动
      if (pumpkinReleased && Math.abs(pumpkin.velocity.x) < 0.01 && Math.abs(pumpkin.velocity.y) < 0.01) {
        resetpumpkin(); // 重置南瓜位置
      }

      // 设置混合模式为 ADD 实现混合效果
      blendMode(ADD);

      // 美丽的火焰效果 :)
      torch1.display(); 
      torch2.display();

      // 重置混合模式为 BLEND 绘制其他对象
      blendMode(BLEND);

      slingshot.display(); // 显示弹弓

      let angle;
      if (!pumpkinHasCollided) {
        if (!pumpkinReleased) {
          angle = atan2(slingshot.origin.y - pumpkin.position.y, slingshot.origin.x - pumpkin.position.x); // 计算南瓜与弹弓之间的角度
        } else {
          let velocity = pumpkin.velocity;
          angle = atan2(velocity.y, velocity.x); // 计算南瓜的速度方向角度
        }
      } else {
        angle = pumpkin.angle; // 使用南瓜的角度（碰撞后）
      }

      push();
      translate(pumpkin.position.x, pumpkin.position.y);
      rotate(angle);
      imageMode(CENTER);
      image(pumpkinImg, 0, 0, 40, 40); // 绘制南瓜图像
      pop();

      for (let box of boxes) {
        box.display(); // 显示游戏对象
      }
    }
  }

  class GameObject {
    constructor(x, y, w, h, img, scale, isMonster = false, isCircular = false) {
      this.isMonster = isMonster;
      this.isCircular = isCircular;
      this.scale = scale;
      this.w = w * scale;
      this.h = h * scale;
      console.log("1111======", w, h)
      if (isCircular) {
        let radius = w * scale / 2;
        this.body = Bodies.circle(x, y, radius); // 创建圆形刚体
      } else {
        this.body = Bodies.rectangle(x, y, w, h); // 创建矩形刚体
      }
      this.body.isMonster = isMonster;
      this.img = img;
      World.add(engine.world, this.body); // 将刚体添加到物理引擎中
    }

    display() {
      console.log("1111======", this.body.position.x, this.body.position.y)
      push();
      translate(this.body.position.x, this.body.position.y);
      rotate(this.body.angle);
      imageMode(CENTER);
      if (this.isCircular) {
        let diameter = this.w;
        image(this.img, 0, 0, diameter, diameter); // 绘制圆形游戏对象图像
      } else {
        image(this.img, 0, 0, this.w, this.h); // 绘制矩形游戏对象图像
      }
      pop();
    }
  }

  class OvalObject extends GameObject {
    constructor(x, y, w, h, img, scale, isMonster = false) {
      super(x, y, w, h, img, scale, isMonster);
    }

    display() {
      push();
      translate(this.body.position.x, this.body.position.y);
      rotate(this.body.angle);
      imageMode(CENTER);
      ellipseMode(CENTER);
      image(this.img, 0, 0, this.w, this.h); // 绘制椭圆形游戏对象图像
      pop();
    }
  }

  class Torch {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.particles = [];
    }

    display() {
      if (frameCount % 2 == 0) {
        this.particles.push(new Particle(this.pos.x, this.pos.y));
      }

      // 更新和绘制粒子
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update();
        this.particles[i].display();
        if (this.particles[i].isDead()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  class Particle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(random(-1, 1), random(-3, -1));
      this.acc = createVector(0, 0);
      this.lifespan = 255;
      this.size = random(10, 20); // 可变大小
    }

    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.lifespan -= 4;
    }

    display() {
      noStroke();
      fill(200 + random(-20, 20), 100 + random(-20, 20), 0, this.lifespan); // 颜色
      ellipse(this.pos.x, this.pos.y, this.size);
    }

    isDead() {
      return this.lifespan < 0;
    }
  }

  class PortalEffect {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.particles = [];
      for (let i = 0; i < 50; i++) {
        this.particles.push(new PortalParticle(this.pos.x, this.pos.y, i));
      }
    }

    update() {
      for (let particle of this.particles) {
        particle.update();
      }
    }

    display() {
      for (let particle of this.particles) {
        particle.display();
      }
    }

    isDead() {
      return this.particles.every(particle => particle.isDead());
    }
  }

  class PortalParticle {
    constructor(x, y, index) {
      this.pos = createVector(x, y);
      this.angle = TWO_PI / 50 * index; // 在圆形中分布粒子
      this.radius = random(2, 4); // 随机螺旋半径
      this.speed = random(0.1, 0.2); // 随机速度
      this.lifespan = 255;
      this.size = random(3, 6);
    }

    update() {
      this.angle += this.speed;
      this.pos.x = this.pos.x + cos(this.angle) * this.radius;
      this.pos.y = this.pos.y + sin(this.angle) * this.radius;
      this.lifespan -= 5;
    }

    display() {
      noStroke();
      fill(random(50, 150), random(0, 100), random(150, 255), this.lifespan); // 酷炫的神秘颜色！
      ellipse(this.pos.x, this.pos.y, this.size);
    }

    isDead() {
      return this.lifespan < 0;
    }
  }

  function collision(event) {
    let pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      let bodyA = pairs[i].bodyA;
      let bodyB = pairs[i].bodyB;

      // 计算碰撞的冲击力大小
      let impactMagnitude = Math.hypot(
        bodyA.velocity.x - bodyB.velocity.x,
        bodyA.velocity.y - bodyB.velocity.y
      );

      // 定义冲击力阈值
      let impactThreshold = 5;

      // 检查碰撞中是否涉及怪物
      let monsterBody = bodyA.isMonster ? bodyA : bodyB.isMonster ? bodyB : null;

      if (monsterBody) {
        // 检查冲击力是否超过阈值
        if (impactMagnitude > impactThreshold) {
          handleExplosion(monsterBody);
        }
      }

      // 传播冲击力
      propagateImpact(bodyA, impactMagnitude, impactThreshold + 1.5, bodyA.position);
      propagateImpact(bodyB, impactMagnitude, impactThreshold + 1.5, bodyB.position);

      // 检查南瓜是否与任何物体发生碰撞
      if (bodyA === pumpkin || bodyB === pumpkin) {
        pumpkinHasCollided = true; // 在碰撞时将南瓜碰撞标志设置为 true
      }
    }
  }

  function propagateImpact(body, impactMagnitude, impactThreshold, originalCollisionPosition, visitedBodies = new Set()) {
    // 如果刚体是静态的或已经被访问过，则不传播冲击力
    if (body.isStatic || visitedBodies.has(body)) {
      return;
    }

    // 将刚体标记为已访问，以避免循环传播
    visitedBodies.add(body);

    let bodiesInContact = Matter.Query.collides(body, boxes.map(box => box.body));
    for (let result of bodiesInContact) {
      let otherBody = result.bodyA === body ? result.bodyB : result.bodyA;

      // 验证冲击力的方向
      let impactFromAbove = body.position.y < otherBody.position.y;

      // 计算与原始碰撞位置的距离
      let distanceFromOriginal = dist(originalCollisionPosition.x, originalCollisionPosition.y, otherBody.position.x, otherBody.position.y);

      // 根据距离减小冲击力大小
      let reducedImpactMagnitude = impactMagnitude / (1 + distanceFromOriginal / 500); // 可以更改此值以调整距离（500）

      // 如果另一个刚体是怪物且减小后的冲击力超过阈值，并且冲击来自上方，则处理爆炸效果
      if (otherBody.isMonster && reducedImpactMagnitude > impactThreshold && impactFromAbove) {
        handleExplosion(otherBody);
      }

      // 传播冲击力到另一个刚体
      propagateImpact(otherBody, reducedImpactMagnitude, impactThreshold, originalCollisionPosition, visitedBodies);
    }
  }

  function handleExplosion(monsterBody) {
    explosionManager.createExplosion(monsterBody.position.x, monsterBody.position.y);
    // 查找并从游戏对象数组中移除怪物
    for (let j = 0; j < boxes.length; j++) {
      if (boxes[j].body === monsterBody) {
        World.remove(engine.world, monsterBody); // 从游戏对象数组中移除怪物
        boxes.splice(j, 1); // 从游戏对象数组中移除怪物
        break; // 找到并移除怪物后退出循环
      }
    }
  }

  class SlingShot {
    constructor(x, y, body) {
      this.origin = createVector(x, y);
      this.body = body;
    }

    display() {
      if (!pumpkinReleased) {
        stroke(255);
        strokeWeight(4);
        line(this.origin.x, this.origin.y, pumpkin.position.x, pumpkin.position.y);
      }
    }
  }

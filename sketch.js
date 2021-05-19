var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var dog, dog_running;
var park, invisiblePark;
var obstaclesGroup, obstacle1;
var score = 0;
var restart;

function preload() {
  dog_running = loadAnimation("dog1.png");
  parkImage = loadImage("bg.png");
  bone1 = loadImage("bone.png");
  obstacle1 = loadImage("obstacle.png");
  
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.mp3");
}

function setup() {
  createCanvas(800, 400);

  park = createSprite(400, 100, 400, 20);
  park.addImage("park", parkImage);
  park.scale = 5;
  park.x = width / 2;

  dog = createSprite(50, 200, 20, 50);
  dog.addAnimation("running", dog_running);
  dog.scale = 0.03;
  dog.setCollider("circle", 0, 0, 300);

  invisibleGround = createSprite(400, 350, 1600, 10);
  invisibleGround.visible = false;

  bonesGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

}

function draw() {
  background(255);

  dog.x = camera.position.x - 270;

  if (gameState === PLAY) {

    park.velocityX = -3

    if (park.x < 100) {
      park.x = 400
    }
    console.log(dog.y)
    if (keyDown("space") && dog.y > 270) {
      jumpSound.play();
      dog.velocityY = -16;
    }

    dog.velocityY = dog.velocityY + 0.8;
    spawnBones();
    spawnObstacles();

    dog.collide(invisibleGround);

    if (obstaclesGroup.isTouching(dog)) {
      collidedSound.play();
      gameState = END;
    }
    if (bonesGroup.isTouching(dog)) {

      bonesGroup.destroyEach();
    }
  } else if (gameState === END) {
    //set velcity of each game object to 0
    dog.velocityY = 0;
    park.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    bonesGroup.setVelocityXEach(0);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bonesGroup.setLifetimeEach(-1);

  }


  drawSprites();


}

function spawnBones() {
  if (frameCount % 150 === 0) {

    var bone = createSprite(camera.position.x + 500, 330, 40, 10);

    bone.velocityX = -(6 + 3 * score / 100)
    bone.scale = 0.2;

    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        bone.addImage(bone1);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the bone           
    bone.scale = 0.05;
    //assign lifetime to the variable
    bone.lifetime = 400;

    bone.setCollider("rectangle", 0, 0, bone.width / 2, bone.height / 2)
    //add each cloud to the group
    bonesGroup.add(bone);

  }

}

function spawnObstacles() {
  if (frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x + 400, 330, 40, 40);
    obstacle.setCollider("rectangle", 0, 0, 200, 200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3 * score / 100)
    obstacle.scale = 0.05;
    //assign scale and lifetime to the obstacle           

    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }
}
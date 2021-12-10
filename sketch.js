//constantes
const JOGAR = 1;
const ENCERRAR = 0;

//variavel
var trex, trexImagem, trexMorto;
var trexbot;
var ground, groundImagem;
var groundHitbox;
var cloud, cloudImagem;
var cacto, cactoImagem1, cactoImagem2, cactoImagem3, cactoImagem4, cactoImagem5, cactoImagem6;
var pontuacao = 0;
var estado = JOGAR;
var cloudsGroup, spinifingsGroup;
var gameOver, gameOverImage;
var restart, restartImage;
var morreu, pontos100, pule;
var dificuldade = -4;

//funções
function clouds(){
    if (frameCount %25 == 0){
        cloud = createSprite(600,30,40,20);
        cloud.velocityX = -5;
        cloud.y = Math.round(random(10,100));
        cloud.addImage("nuvens", cloudImagem);
        cloud.scale = 0.5;
        cloud.depth = trex.depth;
        cloud.lifetime = 150;
        trex.depth ++;
        cloudsGroup.add(cloud);
    }
}
function spinifings(){
   if(frameCount %50 == 0){
        cacto = createSprite(600,170,20,50);
        cacto.velocityX = dificuldade;
        cacto.x = 800
        cacto.lifetime = 200;
        numImage = Math.round(random(1,6));
        switch(numImage){
            case 1:
            cacto.addImage("cacto1", cactoImagem1);
            break;
            case 2:
            cacto.addImage("cacto2", cactoImagem2);
            break;
            case 3:
            cacto.addImage("cacto3", cactoImagem3);
            break;
            case 4:
            cacto.addImage("cacto4", cactoImagem4);
            break;
            case 5:
            cacto.addImage("cacto5", cactoImagem5);
            break;
            case 6:
            cacto.addImage("cacto6", cactoImagem6);
            break;
        }
        cacto.scale = 0.5;
        spinifingsGroup.add(cacto);
        
    }
}
function reset(){
    spinifingsGroup.destroyEach();
    cloudsGroup.destroyEach();
    dificuldade = -4;
    pontuacao = 0;
    estado = JOGAR;
    trex.changeAnimation("running");
}
function preload(){
    trexImagem = loadAnimation("trex1.png","trex2.png","trex3.png");
    trexMorto = loadAnimation("trex_collided.png");
    groundImagem = loadImage("ground2.png");
    cloudImagem = loadImage("cloud.png");
    cactoImagem1 = loadImage("obstacle1.png");
    cactoImagem2 = loadImage("obstacle2.png");
    cactoImagem3 = loadImage("obstacle3.png");
    cactoImagem4 = loadImage("obstacle4.png");
    cactoImagem5 = loadImage("obstacle5.png");
    cactoImagem6 = loadImage("obstacle6.png");
    restartImage = loadImage("restart.png");
    gameOverImage = loadImage("gameOver.png");
    morreu = loadSound("die.mp3");
    pontos100 = loadSound("checkPoint.mp3");
    pule = loadSound("jump.mp3");

}

//basico

function setup() {
    createCanvas(600,200);
    //trex
    trex = createSprite(100,150,20,50);
    trexImagem.frameDelay = 2;
    trex.addAnimation("running",trexImagem);
    trex.addAnimation("dead",trexMorto);
    trex.scale = 0.45;
    trex.setCollider("circle", 0,0,35);
    //ground
    ground = createSprite(300,180,600,20);
    ground.addImage("ground", groundImagem);
    groundHitbox = createSprite(300,200,600,20);
    groundHitbox.visible = false;
    //clouds and cacti
    cloudsGroup = new Group();
    spinifingsGroup = new Group();
    //gameover
    gameOver = createSprite(300,100);
    restart = createSprite(300,140);
    gameOver.addImage("gameover", gameOverImage);
    restart.addImage("try again?", restartImage);
    restart.scale = 0.5; 
    //bot
    //trexbot = createSprite(22   0,150,20,50);
    //trexbot.debug = true;   
    
}

function draw() {
    background('white');
    text(pontuacao + " pontos", 500, 50);
    drawSprites();
    
    if (estado == JOGAR){
        restart.visible = false;
        gameOver.visible = false;
        ground.velocityX = dificuldade;
        if(ground.x <= 0){
            ground.x = ground.width /2;
            
        }
        if(keyDown('space')&& trex.collide(groundHitbox)){
            trex.velocityY = -10;
            pule.play();
        }
        trex.velocityY = trex.velocityY + 0.5;
        clouds();
        spinifings();
        pontuacao = pontuacao + Math.round(getFrameRate()/60);
        if(pontuacao % 100 == 0 && pontuacao != 0 ){
            pontos100.play();
            dificuldade = dificuldade - 1;
            spinifingsGroup.setVelocityXEach(dificuldade);
            //trexbot.x = trexbot.x - 5;
        }
        if (trex.isTouching(spinifingsGroup)){
            morreu.play();
            estado = ENCERRAR;
        }
        //bot fase alpha
        //trexbot.shapeColor = 'white';
        //if(trexbot.isTouching(spinifingsGroup)&&(trex.collide(groundHitbox))){
        //    trex.velocityY = -10;
        //    pule.play();
        //}
    }else if (estado == ENCERRAR){
        ground.velocityX = 0;
        cloudsGroup.setVelocityXEach(0);
        spinifingsGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        spinifingsGroup.setLifetimeEach(-1);
        trex.velocityY = 0;
        trex.changeAnimation("dead");
        gameOver.visible = true;
        restart.visible = true;
        if(mousePressedOver(restart)){
            reset();
        }

    }
    trex.collide(groundHitbox);
}
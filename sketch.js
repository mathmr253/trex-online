var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var gameOver, fimDeJogo
var restart, reinicio

var somPulo, somMorte, somPontos

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  gameOver = loadImage("gameOver.png");
  restart = loadImage ("restart.png");
  
  somPulo = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somPontos = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  solo = createSprite(200,height-20,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  solo.velocityX = -4;
  
  soloinvisivel = createSprite(200,height-10,400,10);
  soloinvisivel.visible = false;
  
  reinicio = createSprite(width/2,height/2, 20, 20);
   reinicio.addImage("reinicio", restart);
  reinicio.visible = false;
    reinicio.scale = 0.7;
  fimDeJogo = createSprite (width/2, height/2 + 50, 20, 20);
  fimDeJogo.visible = false;
   fimDeJogo.addImage("fimDeJogo", gameOver);
    fimDeJogo.scale = 0.5;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  console.log("Oi" + 5);
  
  trex.setCollider("circle",0,0,40);
   //trex.debug = true;
  pontuacao = 0;
}

function draw() {
  background("white");
  text("Pontuação: "+ pontuacao, width - 100,50);
    
  
  if(estadoJogo === JOGAR){
    //mover o solo
    solo.velocityX = -(6+pontuacao/100);
    pontuacao = pontuacao + Math.round(frameRate()/60) 
    
    if(touches.length>0 || keyDown("space")&& trex.y >= height-170) {
       trex.velocityY = -13;
      somPulo.play();
      touches=[]
  }
    
    trex.velocityY = trex.velocityY + 0.8;
     
    if( pontuacao > 0 && pontuacao%1000==0){
      
      somPontos.play();
    }
    
  if (solo.x < 0){
       solo.x = solo.width/2;
    }
    
   
    //gerar as nuvens
    gerarNuvens();
    
    
    //gerar obstáculos no solo
    gerarObstaculos();
  
    if(grupodeobstaculos.isTouching(trex)){
        estadoJogo = ENCERRAR; 
      somMorte.play();
    }
  }
  else if(estadoJogo === ENCERRAR){
    //parar o solo
    solo.velocityX = 0;
  grupodenuvens.setLifetimeEach(-1);
     grupodeobstaculos.setLifetimeEach(-1);     
    grupodeobstaculos.setVelocityXEach(0);     
     grupodenuvens.setVelocityXEach(0);
    fimDeJogo.visible = true;
    reinicio.visible = true;
    trex.velocityY = 0;
    trex.changeAnimation("collided");
  }
 
    trex.collide(soloinvisivel);
     
  if(mousePressedOver(reinicio)){
    reset();
  }
  
    drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(width,height-35,10,40);
  obstaculo.velocityX = -(6+pontuacao/100);
      
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}




function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 300;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adicionando nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}

function reset(){
  estadoJogo = JOGAR;
  fimDeJogo.visible = false;
  reinicio.visible = false;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao = 0;
}
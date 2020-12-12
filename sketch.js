

//Create variables here
var dog, time, hapdog, sadDog, database, FoodCount, feedPet, addFood, fedTime, lastFed, foodObj, changeState, gameState, readState, bed, garden, wash, bedIMG, gardenIMG, washIMG;

function preload() {
  dogIMG = loadImage("../pics/Dog.png");
  hapdog = loadImage("../pics/happy dog.png");
  bedIMG = loadImage("../pics/bedroom.png")
  gardenIMG = loadImage("../pics/Garden.png")
  washIMG = loadImage("../pics/washroom.png")
  sadDog = loadImage("../pics/Lazy.png")
  
}
function setup() {
createCanvas(800, 800);
 dog = createSprite(width/2, height/2, 50,50);
dog.scale = 0.5
 dog.addImage(dogIMG);

 time = hour();

 feedPet = createButton("Feed Pet");
 feedPet.position(600, 95);
 addFood = createButton("Add Food");
 addFood.position(700,95);



foodObj = new Food();
database = firebase.database();
  //foodStock = database.ref('Food');
  //foodStock.on("value", readStock);
readState = database.ref('gameState');
readState.on("value", (data)=>{
  gameState = data.val();
})
}


function draw() {  
background(46,139,87);
  drawSprites();
  //add styles here
  fedTime = database.ref('fedTime');
  fedTime.on("value", (data)=>{
    lastFed=data.val();
  })
  foodObj.getFoodStock();
   feedPet.mousePressed(()=>{
    dog.addImage(hapdog);     
    FoodCount=FoodCount-1;
     foodObj.deductFoodStock(FoodCount);
     database.ref('fedTime').update({
       'fedTime': time
     })
   })

   addFood.mousePressed(()=>{
    FoodCount+=1;
    foodObj.updateFoodStock(FoodCount);
  })
   


  if (gameState!=="hungry"){
    feedPet.hide();
    addFood.show();
  
  } else {
    feedPet.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+lastFed%12 +"PM", 350, 30);
  }
  else if(lastFed===0){
    text("Last Fed : 12AM", 350, 30);
  }
  else {
    text("Last Fed : "+lastFed%12 +"PM", 350, 30);
  }

  if (time===(lastFed+1)){
    foodObj.garden();
    gameState = "playing"
    updateState(gameState);
    //gameState.updateState();
  }
 else if(time>=(lastFed+2)&&time<=(lastFed+4)){
    foodObj.washroom();
    gameState = "bathing";
    updateState(gameState);
  } else{
    gameState = "hungry";
    updateState(gameState);
    dog.addImage(sadDog);
    foodObj.display();
  }


}

function updateState(game){
  database.ref('gameState').update({
    'gameState': game
  })
}




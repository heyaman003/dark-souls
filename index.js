//console.log(gsap);
const gameoversound = new Audio('gameover.wav');
const backgroundsound = new Audio('backgroundsound.mp3');
const shootsound = new Audio('shootsound.mp3');
const canvas = document.querySelector("canvas");
//console.log(canvas);
let score=0;
const scores=document.querySelector('#update');
const gamebtn=document.querySelector('#dabado');
const gamemodale1=document.querySelector('#gamemodal');

const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

class player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
class projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
 const friction=0.99
class particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x *=friction
    this.velocity.y *=friction
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

let player1 = new player(canvas.width / 2, canvas.height / 2, 10, "white");
let projectiles = [];
let enemies = [];
let particles = [];
function restart(){
   player1 = new player(canvas.width / 2, canvas.height / 2, 10, "white");
   projectiles = [];
   enemies = [];
   particles = [];
   score=0;
   scores.innerHTML=score;

}
function createenemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 5) + 5;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    } else {
      x = Math.random() * canvas.width;
      // x = Math.random()<0.5?0-radius:canvas.width+radius
      // y=Math.random()*canvas.height
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new enemy(x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player1.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player1.x - enemy.x, player1.y - enemy.y);

    if (dist - enemy.radius - player1.radius < 1) {
      cancelAnimationFrame(animationId);
     document.querySelector("#finalscore").innerHTML=score;      gamemodale1.style.display='flex'
    backgroundsound.pause();
    gameoversound.play();
    }
    projectiles.forEach((projectile, projectileindex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      //when projectile touch enemies

      if (dist - enemy.radius - projectile.radius < 1) {
        //create explosion of particle
      shootsound.play();
        //now increase the score
    score+=50;
    scores.innerHTML=score;
    
        for (let i = 0; i < enemy.radius*2; i++) {
          particles.push(
            new particle(projectile.x, projectile.y, Math.random()*2, enemy.color, {
              x:( Math.random() - 0.5)* Math.random()*6,
              y: (Math.random() - 0.5)*Math.random()*6
            })
          );
        }
        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileindex, 1);
          }, 0);
        } else {
          score+=100;
          update.innerHTML=score;
          setTimeout(() => {
            enemies.splice(index, 1);
            
            projectiles.splice(projectileindex, 1);
          }, 0);
        }
      }
    });
  });
}
//console.log(player1);
//console.log(projectile1);
addEventListener("click", (event) => {
  console.log(projectiles);
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };

  canvas.addEventListener("touchstart", (event) => {
    console.log(projectiles);
    const angle = Math.atan2(
      event.touches[0].clientY - canvas.height / 2,
      event.touches[0].clientX - canvas.width / 2
    );
  
    const velocity = {
      x: Math.cos(angle) * 3,
      y: Math.sin(angle) * 3,
    }; 
  });


  projectiles.push(
    new projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
  //console.log(projecticle);
});

gamebtn.addEventListener('click',()=>{
  restart();
  animate();
  createenemies();
  backgroundsound.play();
  backgroundsound.volume = 0.8;
  backgroundsound.loop = true;
  gamemodale1.style.display='none'
})
gamebtn.addEventListener('touchstart',()=>{
  restart();
  animate();
  createenemies();
  backgroundsound.play();
  backgroundsound.volume = 0.8;
  backgroundsound.loop = true;
  gamemodale1.style.display='none'
})

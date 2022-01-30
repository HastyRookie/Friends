

let canvas, width, height , ctx;

let fireworks =[];
let particles =[];
var fps,lastCalledTime,delta;
var trophyContainer = document.getElementById('footer-container');

var Y = 6.3,v=32,e=[],h = [];
function setup() {
    canvas = document.getElementById("canvas");
    setSize(canvas);
    ctx = canvas.getContext("2d");
    ctx.fillStyle="#000000";
    ctx.fillRect(0, 0, width,height);
    loadHeart();
    fireworks.push(new Firework(Math.random()*(width-200)+100));
    
    window.addEventListener("resize",windowResized);
    if(clickFireworks)document.addEventListener("click",onClick);
}

window.onload = setup;

function loadHeart(){
	for( i = 0; i <Y; i+=.2 ) { // calculate heart nodes, from http://mathworld.wolfram.com/HeartCurve.html

    h.push([

        width/2 + 180*Math.pow(Math.sin(i), 3),
        height/2 + 10 * (-(15*Math.cos(i) - 5*Math.cos(2*i) - 2*Math.cos(3*i) - Math.cos(4*i)))
    ])
   
   }
   
i = 0;
while (i < v ) {

    x = Math.random() * height;
    y = Math.random() * height;
    //r = R() * 50 + 200;
    //b = R() * r;
    //g = R() * b;

    H = i/v * 80 + 280;
    S = Math.random() * 40 + 60;
    B = Math.random() * 60 + 20;

    f = []; // create new trail

    k = 0;
    
    while ( k < v ) { 
        f[k++] = { // create new particle
            x : x, // position 
            y : y,
            X : 0, // velocity
            Y : 0,
            R : (1 - k/v)  + 1, // radius
            S : Math.random() + 1, // acceleration 
            q : ~~(Math.random() * v), // target node on heart path
            //D : R()>.5?1:-1,
            D : i%2*2-1, // direction around heart path
            F : Math.random() * .2 + .7, // friction
            //f : "rgba(" + ~~r + "," + ~~g + "," + ~~b + ",.1)"
            f : heart_color// colour
        }
    }

    e[i++] = f; // dots are a 2d array of trails x particles
}
}

class Text{
	costructor(text,x,y){
		this.text = text;
		this.x = x;
		this.y = y;
	}
	render(){
		ctx.font = '26px Arial';
		ctx.fillStyle = 'white';
		ctx.fillText(this.text,this.x,this.y);
		
	}
}

function renderHeart(particle) { // draw particle
    ctx.fillStyle = particle.f;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.R, 0, Y, 1);
    ctx.closePath();
    ctx.fill();
}

function updateHeart(){
	 ctx.fillStyle = "rgba(12,8,4,0.2)"; // clear screen
    ctx.fillRect(0,0,width,height);

    i = v;
    while (i--) {

        f = e[ i ]; // get worm
        u = f[ 0 ]; // get 1st particle of worm
        q = h[ u.q ]; // get current node on heart path
        D = u.x - q[0]; // calc distance
        E = u.y - q[1];
        G = Math.sqrt( (D * D) + (E * E) );
        
        if ( G < 10 ) { // has trail reached target node?
            if (Math.random() > .95 ) { // randomly send a trail elsewhere
                u.q = ~~(Math.random() * v);
            } else {
                if ( Math.random() > .99) u.D *= -1; // randomly change direction
                u.q += u.D;
                u.q %= v;
                if ( u.q < 0 ) u.q += v;
             }
        }

        u.X += -D / G * u.S; // calculate velocity
        u.Y += -E / G * u.S;

        u.x += u.X; // apply velocity
        u.y += u.Y;

        renderHeart(u); // draw the first particle

        u.X *= u.F; // apply friction
        u.Y *= u.F;

        k = 0;
        while ( k < v-1 ) { // loop through remaining dots
            
            T = f[ k ]; // this particle
            N = f[ ++k ]; // next particle

            N.x -= (N.x - T.x) * .7; // use zenos paradox to create trail
            N.y -= (N.y - T.y) * .7;

            renderHeart(N);

        }

    }
}

function loop(){
	
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, width, height);
    ctx.globalAlpha = 1;
    
    updateHeart();
    
    for(let i=0; i<fireworks.length;  i++){
        let done = fireworks[i].update();
        fireworks[i].draw();
        if(done) fireworks.splice(i,1);
    
}

        for(let i=0; i<particles.length;i++){
            particles[i].update();
            particles[i].draw();
            if(particles[i].lifetime>700) particles.splice(i,1);
        }
        if(Math.random()<1/60) fireworks.push(new Firework(Math.random()*(width-200)+100,canvas.height));
    }

setInterval(loop, 1/60);
//setInterval(loop, 100/60);

function random(min,max,decimal=0){
	return Number((Math.random() * (max - min) + min).toFixed(decimal));
}
    class Particle{
        constructor(x,y,col){
            this.x=x;
            this.y=y;
            this.col=col;
            this.radius = 3;
            this.vel = randomVec(3);
            this.lifetime =0;
        }

        update(){
            this.x += this.vel.x + Math.sin(this.y * random(5,10));
            this.y+= this.vel.y;
            this.vel.y += 0.02;
            this.vel.x *= 0.99;
            this.vel.y *= 0.99;
            
            this.lifetime++;
        }
        draw(){
            ctx.globalAlpha = Math.max(1-this.lifetime/80, 0);
            ctx.beginPath();
            ctx.fillStyle = this.col;
            ctx.arc(this.x, this.y,this.radius,0,6);
            ctx.fill();
        }
    }

        class Firework { 
            constructor(x,y) {
                this.x = x;
                this.y = y;
                this.vel = {x: random(-0.006, 0.006, 3), y: random(0.008, 0.08, 3)};
                this.isBlown = false;
                this.col = randomCol();
            }

        update(){
        	  this.x += this.vel.x + Math.sin(this.y * random(5,10));
            this.y -= 3;
            if(this.y < 350-Math.sqrt(Math.random()*500)*40){
                this.isBlown  = true;
                for(let i=0; i<60; i++){
                    particles.push(new Particle(this.x, this.y, this.col))

                }
            }
            return this.isBlown;

        }
        draw(){
        	  // this.x = this.vel.x;
            ctx.globalAlpha =1;
            ctx.beginPath();
            ctx.fillStyle = this.col;
            ctx.arc(this.x,this.y,3,0,6);
            ctx.fill();
        }
    }
    function randomCol(){
        var letter ='0123456789ABCDEF';
        var nums = [];
        
        for(var i=0; i<3; i++){
            nums[i] = Math.floor(Math.random()*256);
        }
        
        let brightest = 0;
        for(var i=0; i<3; i++){
            if(brightest<nums[i]) brightest = nums[i];
        }

        brightest /=255;
        for(var i=0; i<3; i++){
        nums[i]/= brightest;

    }

    let color ="#";
    for(var i=0; i<3; i++){
        color += letter[Math.floor(nums[i]/16)];
        color += letter[Math.floor(nums[i]%16)];
    }
    return color;
}

    function randomVec(max){
        let dir = random(1,Math.PI*9);
        let spd = random(1,max)
        return{x: Math.cos(dir)*spd, y: Math.sin(dir)* spd};
    }
function degToRad(degs){
    return (Math.PI / 180) * degs;
}

function calcVelocity(angle) {
    return {x:
        Math.cos(degToRad(angle)),
        y:-Math.sin(degToRad(angle))};
}
    function setSize(canv){
        canv.style.width = (trophyContainer.clientWidth)+ "px";
        canv.style.height = (trophyContainer.clientHeight) + "px";
        width = trophyContainer.clientWidth;
        height =  trophyContainer.clientHeight;

        canv.width =  width * window.devicePixelRatio;
        canv.height = height * window.devicePixelRatio;
        canvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    function onClick(e){
        fireworks.push(new Firework(e.clientX,e.clientY));

    }

    function windowResized(){
        setSize(canvas);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0 , width, height);
}


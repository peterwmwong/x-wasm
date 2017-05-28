"use strict";

/* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/
   contributed by Isaac Gouy */

const PI = 3.141592653589793;
const SOLAR_MASS = 4 * PI * PI;
const DAYS_PER_YEAR = 365.24;

function Body(x,y,z,vx,vy,vz,mass){
   this.x = x;
   this.y = y;
   this.z = z;
   this.vx = vx;
   this.vy = vy;
   this.vz = vz;
   this.mass = mass;
}

Body.prototype.offsetMomentum = function(px,py,pz) {
   this.vx = -px / SOLAR_MASS;
   this.vy = -py / SOLAR_MASS;
   this.vz = -pz / SOLAR_MASS;
   return this;
}

function Jupiter(){
   return new Body(
      4.84143144246472090e+00,
      -1.16032004402742839e+00,
      -1.03622044471123109e-01,
      1.66007664274403694e-03 * DAYS_PER_YEAR,
      7.69901118419740425e-03 * DAYS_PER_YEAR,
      -6.90460016972063023e-05 * DAYS_PER_YEAR,
      9.54791938424326609e-04 * SOLAR_MASS
   );
}

function Saturn(){
   return new Body(
      8.34336671824457987e+00,
      4.12479856412430479e+00,
      -4.03523417114321381e-01,
      -2.76742510726862411e-03 * DAYS_PER_YEAR,
      4.99852801234917238e-03 * DAYS_PER_YEAR,
      2.30417297573763929e-05 * DAYS_PER_YEAR,
      2.85885980666130812e-04 * SOLAR_MASS
   );
}

function Uranus(){
   return new Body(
      1.28943695621391310e+01,
      -1.51111514016986312e+01,
      -2.23307578892655734e-01,
      2.96460137564761618e-03 * DAYS_PER_YEAR,
      2.37847173959480950e-03 * DAYS_PER_YEAR,
      -2.96589568540237556e-05 * DAYS_PER_YEAR,
      4.36624404335156298e-05 * SOLAR_MASS
   );
}

function Neptune(){
   return new Body(
      1.53796971148509165e+01,
      -2.59193146099879641e+01,
      1.79258772950371181e-01,
      2.68067772490389322e-03 * DAYS_PER_YEAR,
      1.62824170038242295e-03 * DAYS_PER_YEAR,
      -9.51592254519715870e-05 * DAYS_PER_YEAR,
      5.15138902046611451e-05 * SOLAR_MASS
   );
}

function Sun(){
   return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS);
}


function NBodySystem(bodies){
   this.bodies = bodies;
   let px = 0.0;
   let py = 0.0;
   let pz = 0.0;
   const size = bodies.length;
   for (let i=0; i<size;){
      const b = bodies[i++];
      const m = b.mass;
      px += b.vx * m;
      py += b.vy * m;
      pz += b.vz * m;
   }
   bodies[0].offsetMomentum(px,py,pz);
}

NBodySystem.prototype.updateBodies = function(dt){
  let body;
  const bodies = this.bodies;
  for (let i=0; i<bodies.length;) {
    body = bodies[i++];
    body.x += dt * body.vx;
    body.y += dt * body.vy;
    body.z += dt * body.vz;
  }
}

NBodySystem.prototype.advanceBodies = function(dt){
  let dx, dy, dz, distance, mag, bodyj, bodyi, imass, jmass;
  const bodies = this.bodies;
  const size = bodies.length;

  for (let i=0; i<size;) {
    bodyi = bodies[i++];
    imass = bodyi.mass;
    for (let j=i; j<size;) {
      bodyj = bodies[j++];
      jmass = bodyj.mass;
      dx = bodyi.x - bodyj.x;
      dy = bodyi.y - bodyj.y;
      dz = bodyi.z - bodyj.z;

      distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      mag = dt / (distance * distance * distance);

      bodyi.vx -= dx * jmass * mag;
      bodyi.vy -= dy * jmass * mag;
      bodyi.vz -= dz * jmass * mag;

      bodyj.vx += dx * imass * mag;
      bodyj.vy += dy * imass * mag;
      bodyj.vz += dz * imass * mag;
    }
  }
}

NBodySystem.prototype.advance = function(dt){
  this.advanceBodies(dt);
  this.updateBodies(dt);
}

NBodySystem.prototype.energy = function(){
   let dx, dy, dz, distance;
   let e = 0.0;
   const bodies = this.bodies;
   const size = bodies.length;

   for (let i=0; i<size;) {
      let bodyi = bodies[i++];

      e += 0.5 * bodyi.mass *
         ( bodyi.vx * bodyi.vx
         + bodyi.vy * bodyi.vy
         + bodyi.vz * bodyi.vz );

      for (let j=i; j<size;) {
         let bodyj = bodies[j++];
         dx = bodyi.x - bodyj.x;
         dy = bodyi.y - bodyj.y;
         dz = bodyi.z - bodyj.z;

         distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
         e -= (bodyi.mass * bodyj.mass) / distance;
      }
   }
   return e;
}

function run(n){
  const bodies = new NBodySystem([
    Sun(),Jupiter(),Saturn(),Uranus(),Neptune()
  ]);

  for (let i=0; i<n; i++){ bodies.advance(0.01); }
  print(bodies.energy().toFixed(17));
}

run(50000000);

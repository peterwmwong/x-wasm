"use strict";

/* The Computer Language Benchmarks Game
http://benchmarksgame.alioth.debian.org/
contributed by Isaac Gouy */

const PI = 3.141592653589793;
const SOLAR_MASS = 4 * PI * PI;
const DAYS_PER_YEAR = 365.24;

function Body(x,y,z,vx,vy,vz,mass,next){
  this.x = x;
  this.y = y;
  this.z = z;
  this.vx = vx;
  this.vy = vy;
  this.vz = vz;
  this.mass = mass;
  this.next = next;
}

Body.prototype.offsetMomentum = function(px,py,pz) {
  this.vx = -px / SOLAR_MASS;
  this.vy = -py / SOLAR_MASS;
  this.vz = -pz / SOLAR_MASS;
}

function Jupiter(next){
  return new Body(
    4.84143144246472090e+00,
    -1.16032004402742839e+00,
    -1.03622044471123109e-01,
    1.66007664274403694e-03 * DAYS_PER_YEAR,
    7.69901118419740425e-03 * DAYS_PER_YEAR,
    -6.90460016972063023e-05 * DAYS_PER_YEAR,
    9.54791938424326609e-04 * SOLAR_MASS,
    next
  );
}

function Saturn(next){
  return new Body(
    8.34336671824457987e+00,
    4.12479856412430479e+00,
    -4.03523417114321381e-01,
    -2.76742510726862411e-03 * DAYS_PER_YEAR,
    4.99852801234917238e-03 * DAYS_PER_YEAR,
    2.30417297573763929e-05 * DAYS_PER_YEAR,
    2.85885980666130812e-04 * SOLAR_MASS,
    next
  );
}

function Uranus(next){
  return new Body(
    1.28943695621391310e+01,
    -1.51111514016986312e+01,
    -2.23307578892655734e-01,
    2.96460137564761618e-03 * DAYS_PER_YEAR,
    2.37847173959480950e-03 * DAYS_PER_YEAR,
    -2.96589568540237556e-05 * DAYS_PER_YEAR,
    4.36624404335156298e-05 * SOLAR_MASS,
    next
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
    5.15138902046611451e-05 * SOLAR_MASS,
    null
  );
}

function Sun(next){
  return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS, next);
}


function NBodySystem(firstBody){
  this.firstBody = firstBody;

  let px = 0.0;
  let py = 0.0;
  let pz = 0.0;
  let b = firstBody;
  do {
    const m = b.mass;
    px += b.vx * m;
    py += b.vy * m;
    pz += b.vz * m;
  } while ((b = b.next) !== null);

  firstBody.offsetMomentum(px,py,pz);
}

NBodySystem.prototype.updateBodies = function(dt){
  let body = this.firstBody;
  do {
    body.x += dt * body.vx;
    body.y += dt * body.vy;
    body.z += dt * body.vz;
  } while ((body = body.next) !== null);
}

NBodySystem.prototype.advanceBodies = function(dt){
  let next;
  let bodyi = this.firstBody;
  do {
    const imass = bodyi.mass;
    const bx = bodyi.x;
    const by = bodyi.y;
    const bz = bodyi.z;

    let bodyj = next = bodyi.next;
    while(bodyj !== null) {
      const jmass = bodyj.mass;
      const dx = bx - bodyj.x;
      const dy = by - bodyj.y;
      const dz = bz - bodyj.z;

      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const mag = dt / (distance * distance * distance);

      bodyi.vx -= dx * jmass * mag;
      bodyi.vy -= dy * jmass * mag;
      bodyi.vz -= dz * jmass * mag;

      bodyj.vx += dx * imass * mag;
      bodyj.vy += dy * imass * mag;
      bodyj.vz += dz * imass * mag;
      bodyj = bodyj.next;
    }
  } while ((bodyi = next) !== null);
}

NBodySystem.prototype.advance = function(dt){
  this.advanceBodies(dt);
  this.updateBodies(dt);
}

NBodySystem.prototype.energy = function(){
  let e = 0.0;
  let bodyi = this.firstBody;
  do {
    const bmass = bodyi.mass;
    const bx = bodyi.x;
    const by = bodyi.y;
    const bz = bodyi.z;

    e += 0.5 * bmass *
          ( bodyi.vx * bodyi.vx
          + bodyi.vy * bodyi.vy
          + bodyi.vz * bodyi.vz );

    let bodyj = bodyi = bodyi.next;
    while(bodyj !== null) {
      const dx = bx - bodyj.x;
      const dy = by - bodyj.y;
      const dz = bz - bodyj.z;
      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      e -= (bmass * bodyj.mass) / distance;
      bodyj = bodyj.next;
    }
  } while (bodyi !== null);
  return e;
}

function run(n){
  const bodies = new NBodySystem(
    Sun(Jupiter(Saturn(Uranus(Neptune()))))
  );

  for (let i=0; i<n; i++){ bodies.advance(0.01); }
  print(bodies.energy().toFixed(17));
}

run(50000000);

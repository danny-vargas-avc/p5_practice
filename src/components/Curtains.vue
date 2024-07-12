<template>
  <div id="app">
    <div ref="parentDiv">
      <div ref="canvasContainer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const parentDiv = ref(null);
const canvasContainer = ref(null);
const imgSrc = "./assets/f1.jpg"; // Provide the path to your image here

let audio;
const decayFactor = 0.95; // Decay factor for slowing down particles
const MAX_CANVAS_SIZE = 500;

function injectAudioElement() {
  audio = document.createElement("audio");
  audio.src = "./assets/f1.mp3";
  audio.style.display = "none";
  parentDiv.value.appendChild(audio);
}

onMounted(() => {
  setTimeout(() => {
    injectAudioElement();
  }, 1000);

  function sketch(p) {
    let particles = [];
    let img;
    let resolution;

    p.preload = () => {
      img = p.loadImage(imgSrc);
    };

    p.setup = () => {
      const canvasWidth = Math.min(p.windowWidth, MAX_CANVAS_SIZE);
      const canvasHeight = Math.min(p.windowHeight, MAX_CANVAS_SIZE * 2);
      resolution = Math.max(
        16,
        Math.floor(Math.min(canvasWidth, canvasHeight) / 50)
      ); // Adjust resolution based on canvas size

      const canvas = p
        .createCanvas(canvasWidth, canvasHeight, {
          willReadFrequently: true,
        })
        .parent(canvasContainer.value);
      if (img) {
        placeParticles();
      }
      p.noStroke();
    };

    p.draw = () => {
      p.background(255);
      for (let i = 0; i < particles.length; i++) {
        updateParticle(particles[i]);
        drawParticle(particles[i]);
      }
    };

    p.mousePressed = () => {
      if (audio) {
        audio.currentTime = 0; // Reset audio to the beginning
        audio.play();
        console.log("Audio playing");
      }
    };

    p.mouseReleased = () => {
      if (audio && !audio.paused) {
        audio.pause();
        console.log("Audio paused");
      }
    };

    function placeParticles() {
      particles = []; // Clear existing particles
      img.loadPixels(); // Ensure pixels are loaded before accessing them
      for (let i = 0; i < p.width; i += resolution) {
        for (let j = 0; j < p.height; j += resolution / 4) {
          // Map canvas coordinates to the image coordinates
          let x = (i / p.width) * img.width;
          let y = (j / p.height) * img.height;

          // Get the color of the pixel at the mapped image coordinates
          let c = img.get(x, y);

          // create a particle if the pixel isnt white
          if (c[0] + c[1] + c[2] != 255 * 10) {
            particles.push(createParticle(i, j, c));
          }
        }
      }
    }

    // todo:
    // greyscale approach with drawing the particles
    // 
    function createParticle(x, y, c) {
      return {
        x: x,
        y: y,
        c: c,
        homeX: x,
        homeY: y,
        vel: p.createVector(0, p.random(2, 5)),
        acc: p.createVector(0, 0),
      };
    }

    function applyForce(particle, force) {
      particle.acc.add(force);
    }

    function updateParticle(particle) {
      if (p.mouseIsPressed) {
        // Calculate the distance between the particle and the mouse
        let mouseD = p.dist(particle.x, particle.y, p.mouseX, p.mouseY);
        if (mouseD < 30) {
          // Calculate the angle between the particle and the mouse
          let mouseA = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
          // Create a force vector based on the angle and scale the force based on the distance and apply constraints
          let force = p.createVector(p.cos(mouseA), p.sin(mouseA));
          force.mult(p.constrain(p.map(mouseD, 0, 30, 5, 0), 0, 10));
          applyForce(particle, force);
        }
      }

      // Calculate the distance between the particle and its home position
      let homeD = p.dist(
        particle.x,
        particle.y,
        particle.homeX,
        particle.homeY
      );
      // Calculate the angle between the particle and its home position
      let homeA = p.atan2(
        particle.homeY - particle.y,
        particle.homeX - particle.x
      );
      // Create a force vector pointing towards the home position
      // and scale the force based on the distance to the home position
      let homeForce = p.createVector(p.cos(homeA), p.sin(homeA));
      homeForce.mult(p.map(homeD, 0, 20, 0, 1));
      applyForce(particle, homeForce);

      // Update the particle's velocity with the accumulated acceleration
      // and apply the decay factor to the velocity to simulate friction
      particle.vel.add(particle.acc);
      particle.vel.mult(decayFactor);
      
      // Update the particle's position with its velocity
      particle.x += particle.vel.x;
      particle.y += particle.vel.y;
      
      // Reset the acceleration for the next frame
      particle.acc.mult(0);

      // Wrap the particle around the canvas edges
      if (particle.x > p.width) particle.x = 0;
      if (particle.x < 0) particle.x = p.width;
      if (particle.y > p.height) particle.y = 0;
      if (particle.y < 0) particle.y = p.height;

      // Correct the position if it wraps around too far
      if (Math.abs(particle.x - particle.homeX) > p.width / 2) {
        particle.x = particle.homeX;
      }
      if (Math.abs(particle.y - particle.homeY) > p.height / 2) {
        particle.y = particle.homeY;
      }
    }

    function drawParticle(particle) {
      p.fill(particle.c);
      p.ellipse(particle.x, particle.y, resolution, resolution);
    }

    p.windowResized = () => {
      p.resizeCanvas(
        Math.min(p.windowWidth, MAX_CANVAS_SIZE),
        Math.min(p.windowHeight, MAX_CANVAS_SIZE * 2)
      );
      if (img) {
        placeParticles();
      }
    };
  }

  new p5(sketch, canvasContainer.value);
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>

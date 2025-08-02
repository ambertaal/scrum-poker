<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';

  const canvas = ref<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame: number;
  let confetti: any[] = [];

  const confettiCount = 150;
  const gravity = 0.5;
  const terminalVelocity = 5;
  const drag = 0.075;
  const colors = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#90be6d', '#43aa8b', '#577590'];

  const initConfetti = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (!canvas.value) return;

    canvas.value.width = width;
    canvas.value.height = height;
    ctx = canvas.value.getContext('2d');

    confetti = Array.from({ length: confettiCount }, () => ({
      color: colors[Math.floor(Math.random() * colors.length)],
      dimensions: {
        x: Math.random() * 10 + 10,
        y: Math.random() * 10 + 10,
      },
      position: {
        x: Math.random() * width,
        y: Math.random() * height - height,
      },
      rotation: Math.random() * 2 * Math.PI,
      scale: {
        x: 1,
        y: 1,
      },
      velocity: {
        x: Math.random() * 10 - 5,
        y: Math.random() * -10,
      },
    }));
  }

  const render = () => {
    if (!ctx || !canvas.value) return;

    const width = canvas.value.width;
    const height = canvas.value.height;

    ctx.clearRect(0, 0, width, height);

    confetti.forEach((c) => {
      c.velocity.x -= c.velocity.x * drag;
      c.velocity.y = Math.min(c.velocity.y + gravity, terminalVelocity);
      c.position.x += c.velocity.x;
      c.position.y += c.velocity.y;

      c.rotation += c.velocity.x * 0.05;

      ctx.save();
      ctx.translate(c.position.x, c.position.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.dimensions.x / 2, -c.dimensions.y / 2, c.dimensions.x, c.dimensions.y);
      ctx.restore();
    });

    animationFrame = requestAnimationFrame(render);
  }

  onMounted(() => {
    initConfetti();
    render();
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
  });
</script>

<template>
  <canvas ref="canvas" class="confetti-canvas" />
</template>

<style scoped>
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
}
</style>

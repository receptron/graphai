<template>
  <div class="cube-container">
    <div class="cube">
      <div class="face front">
        <img src="/images/cube_face.png" alt="Front Image" />
      </div>
      <div class="face right">
        <img src="/images/cube_face.png" alt="Right Image" />
      </div>
      <div class="face back">
        <img src="/images/cube_face.png" alt="Back Image" />
      </div>
      <div class="face left">
        <img src="/images/cube_face.png" alt="Left Image" />
      </div>
      <div class="face top">
        <img src="/images/cube_face.png" alt="Top Image" />
      </div>
      <div class="face bottom">
        <img src="/images/cube_face.png" alt="Bottom Image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cube-container {
  --face-size: 100px;
  --translate-z: 50px;

  @media (min-width: 640px) {
    --face-size: 140px;
    --translate-z: 70px;
  }
}

.cube-container {
  perspective: 600px;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.cube {
  width: var(--face-size);
  height: var(--face-size);

  position: relative;
  transform-style: preserve-3d;

  transform-origin: center center;

  animation: rotate 25s linear infinite;
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;

  transform-origin: center center;
}

.face img {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.75;
}

.front {
  transform: translateZ(var(--translate-z));
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.back {
  transform: rotateY(180deg) translateZ(var(--translate-z));
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.right {
  transform: rotateY(90deg) translateZ(var(--translate-z));
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.left {
  transform: rotateY(-90deg) translateZ(var(--translate-z));
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.top {
  transform: rotateX(90deg) translateZ(var(--translate-z));
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

.bottom {
  transform: rotateX(-90deg) translateZ(var(--translate-z));
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
}

@keyframes rotate {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}
</style>

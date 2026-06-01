// Shared scroll state bridge between DOM scroll listeners (Hero) and the R3F
// render loop (HeroScene). Both import the same module instance, so the 3D
// scene can read scroll progress inside useFrame without prop-drilling into
// the Canvas tree.
export const scrollState = {
  /** 0 → 1 across the pinned hero section */
  heroProgress: 0,
  /** smoothed pointer position, -1 → 1, for parallax tilt */
  pointerX: 0,
  pointerY: 0,
};

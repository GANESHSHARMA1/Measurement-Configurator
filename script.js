const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const distancePx = document.getElementById("distance-px");
const distanceCm = document.getElementById("distance-cm");
const distanceFeet = document.getElementById("distance-feet");
const container = document.querySelector(".container");

let isDragging = false;
let activeLine = null;

const PX_TO_CM = 0.02646;
const CM_TO_FEET = 1 / 30.48;

function interpolateColor(color1, color2, factor) {
  const result = color1.map((start, index) => {
    const end = color2[index];
    return Math.round(start + factor * (end - start));
  });
  return `rgb(${result.join(",")})`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

const colorStart = hexToRgb("#ADD8E6");
const colorEnd = hexToRgb("#F08080");

function calculateDistance() {
  const line1Top = line1.offsetTop;
  const line2Top = line2.offsetTop;
  const distance = Math.abs(line2Top - line1Top);

  const distanceInCm = distance * PX_TO_CM;
  const distanceInFeet = distanceInCm * CM_TO_FEET;

  distancePx.textContent = `${distance}px`;
  distanceCm.textContent = `${distanceInCm.toFixed(2)} cm`;
  distanceFeet.textContent = `${distanceInFeet.toFixed(2)} ft`;

  const maxDistance = container.offsetHeight;
  const factor = Math.min(distance / maxDistance, 1);

  const newColor = interpolateColor(colorStart, colorEnd, factor);
  container.style.backgroundColor = newColor;
}

line2.addEventListener("mousedown", (e) => {
  isDragging = true;
  activeLine = line2;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && activeLine) {
    const containerRect = container.getBoundingClientRect();
    let newY = e.clientY - containerRect.top;

    if (newY < 0) newY = 0;
    if (newY > containerRect.height - activeLine.offsetHeight) {
      newY = containerRect.height - activeLine.offsetHeight;
    }

    activeLine.style.top = `${newY}px`;
    calculateDistance();
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  activeLine = null;
});

calculateDistance();

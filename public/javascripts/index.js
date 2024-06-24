/* ------------------------ Watermark (Please Ignore) ----------------------- */
const createSVG = (width, height, className, childType, childAttributes) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
    const child = document.createElementNS(
      "http://www.w3.org/2000/svg",
      childType
    );
  
    for (const attr in childAttributes) {
      child.setAttribute(attr, childAttributes[attr]);
    }
  
    svg.appendChild(child);
  
    return { svg, child };
  };
  
  document.querySelectorAll(".generate-button").forEach((button) => {
    const width = button.offsetWidth;
    const height = button.offsetHeight;
  
    const style = getComputedStyle(button);
  
    const strokeGroup = document.createElement("div");
    strokeGroup.classList.add("stroke");
  
    const { svg: stroke } = createSVG(width, height, "stroke-line", "rect", {
      x: "0",
      y: "0",
      width: "100%",
      height: "100%",
      rx: parseInt(style.borderRadius, 10),
      ry: parseInt(style.borderRadius, 10),
      pathLength: "30"
    });
  
    strokeGroup.appendChild(stroke);
    button.appendChild(strokeGroup);
  
    const stars = gsap.to(button, {
      repeat: -1,
      repeatDelay: 0.5,
      paused: true,
      keyframes: [
        {
          "--generate-button-star-2-scale": ".5",
          "--generate-button-star-2-opacity": ".25",
          "--generate-button-star-3-scale": "1.25",
          "--generate-button-star-3-opacity": "1",
          duration: 0.3
        },
        {
          "--generate-button-star-1-scale": "1.5",
          "--generate-button-star-1-opacity": ".5",
          "--generate-button-star-2-scale": ".5",
          "--generate-button-star-3-scale": "1",
          "--generate-button-star-3-opacity": ".5",
          duration: 0.3
        },
        {
          "--generate-button-star-1-scale": "1",
          "--generate-button-star-1-opacity": ".25",
          "--generate-button-star-2-scale": "1.15",
          "--generate-button-star-2-opacity": "1",
          duration: 0.3
        },
        {
          "--generate-button-star-2-scale": "1",
          duration: 0.35
        }
      ]
    });
  
    button.addEventListener("pointerenter", () => {
      gsap.to(button, {
        "--generate-button-dots-opacity": "1",
        duration: 0.5,
        onStart: () => {
          setTimeout(() => stars.restart().play(), 500);
        }
      });
    });
  
    button.addEventListener("pointerleave", () => {
      gsap.to(button, {
        "--generate-button-dots-opacity": "0",
        "--generate-button-star-1-opacity": ".25",
        "--generate-button-star-1-scale": "1",
        "--generate-button-star-2-opacity": "1",
        "--generate-button-star-2-scale": "1",
        "--generate-button-star-3-opacity": ".5",
        "--generate-button-star-3-scale": "1",
        duration: 0.15,
        onComplete: () => {
          stars.pause();
        }
      });
    });
  });
  
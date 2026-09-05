import { MemeTemplateId } from "../types";

export interface RenderMemeOptions {
  templateId: MemeTemplateId;
  topText: string;
  bottomText: string;
  triggerLabel?: string;
  caption?: string;
  watermark?: string;
}

// Word wrapping utility for canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Draw classic meme text with thick black outline and white fill
function drawMemeText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize = 42,
  align: CanvasTextAlign = "center"
) {
  ctx.save();
  ctx.font = `900 ${fontSize}px "Anton", "Bebas Neue", "Impact", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  const lines = wrapText(ctx, text.toUpperCase(), maxWidth);
  const lineHeight = fontSize * 1.15;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;

    // Stroke outline
    ctx.lineWidth = Math.max(6, fontSize / 7);
    ctx.strokeStyle = "#000000";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(line, x, lineY);

    // Main fill
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(line, x, lineY);
  });

  ctx.restore();
}

export function renderMemeToDataUrl(options: RenderMemeOptions): string {
  const {
    templateId,
    topText,
    bottomText,
    triggerLabel = "App Interaction",
    watermark = "MemeTrigger.app",
  } = options;

  const canvas = document.createElement("canvas");
  const width = 800;
  const height = templateId === "modern-card" || templateId === "buff-doge" ? 600 : 800;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Render based on template
  switch (templateId) {
    case "this-is-fine":
      renderThisIsFine(ctx, width, height);
      break;
    case "drake":
      renderDrake(ctx, width, height, topText, bottomText);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
    case "two-buttons":
      renderTwoButtons(ctx, width, height, topText, bottomText);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
    case "distracted-boyfriend":
      renderDistractedBoyfriend(ctx, width, height, topText, bottomText);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
    case "panik-kalm":
      renderPanikKalm(ctx, width, height, topText, bottomText);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
    case "buff-doge":
      renderBuffDoge(ctx, width, height, topText, bottomText);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
    case "expanding-brain":
      renderExpandingBrain(ctx, width, height, topText, bottomText);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
    case "modern-card":
      renderModernCard(ctx, width, height, topText, bottomText, triggerLabel);
      return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, false);
    default:
      renderThisIsFine(ctx, width, height);
  }

  // Classic top & bottom text overlay for single-frame templates
  drawMemeText(ctx, topText, width / 2, 70, width - 60, 48);
  drawMemeText(ctx, bottomText, width / 2, height - 75, width - 60, 48);

  return finishCanvas(canvas, ctx, width, height, watermark, triggerLabel, true);
}

function finishCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  watermark: string,
  triggerLabel: string,
  drawWatermark = true
): string {
  if (drawWatermark) {
    ctx.save();
    // Subtle top banner with trigger origin
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, width, 24);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`⚡ TRIGGER: ${triggerLabel.toUpperCase()}`, 14, 16);

    // Watermark tag
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "right";
    ctx.fillText(watermark, width - 14, 16);
    ctx.restore();
  }
  return canvas.toDataURL("image/png");
}

// 1. "THIS IS FINE"
function renderThisIsFine(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Background room wall
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#ca8a04");
  bgGrad.addColorStop(0.6, "#ea580c");
  bgGrad.addColorStop(1, "#991b1b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Flaming background shapes
  ctx.fillStyle = "#dc2626";
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 100, height);
    ctx.quadraticCurveTo(i * 100 + 40, height - 350 - (i % 3) * 60, i * 100 + 70, height - 180);
    ctx.quadraticCurveTo(i * 100 + 100, height - 320, i * 100 + 120, height);
    ctx.fill();
  }

  ctx.fillStyle = "#f59e0b";
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 110 + 20, height);
    ctx.quadraticCurveTo(i * 110 + 50, height - 260 - (i % 2) * 50, i * 110 + 80, height - 120);
    ctx.quadraticCurveTo(i * 110 + 100, height - 240, i * 110 + 120, height);
    ctx.fill();
  }

  // Room floor
  ctx.fillStyle = "#78350f";
  ctx.fillRect(0, height - 180, width, 180);

  // Wooden table
  ctx.fillStyle = "#b45309";
  ctx.fillRect(200, height - 220, 420, 24);
  ctx.fillRect(240, height - 196, 20, 196);
  ctx.fillRect(560, height - 196, 20, 196);

  // Coffee cup on table
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.roundRect(290, height - 255, 34, 35, [0, 0, 6, 6]);
  ctx.fill();
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(326, height - 238, 9, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // Steam from cup
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, height - 260);
  ctx.quadraticCurveTo(295, height - 275, 305, height - 290);
  ctx.stroke();

  // Chair
  ctx.fillStyle = "#92400e";
  ctx.fillRect(450, height - 380, 18, 200);
  ctx.fillRect(440, height - 240, 140, 20);
  ctx.fillRect(520, height - 220, 18, 220);

  // The Dog Body
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.ellipse(450, height - 270, 75, 55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Dog Head
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(430, height - 340, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dog Bowler Hat
  ctx.fillStyle = "#78350f";
  ctx.beginPath();
  ctx.ellipse(425, height - 395, 65, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(425, height - 410, 40, Math.PI, 0);
  ctx.fill();
  ctx.stroke();
  // Hat band
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(387, height - 408, 76, 8);

  // Dog Eyes (calm, slightly dissociated)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(410, height - 345, 15, 0, Math.PI * 2);
  ctx.arc(450, height - 345, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupils
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(412, height - 345, 6, 0, Math.PI * 2);
  ctx.arc(452, height - 345, 6, 0, Math.PI * 2);
  ctx.fill();

  // Dog Snout & Smile
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.ellipse(430, height - 315, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Nose
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.ellipse(430, height - 322, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Peaceful polite smile
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(430, height - 318, 12, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Dog Ears
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.ellipse(375, height - 325, 14, 30, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Speech bubble: "THIS IS FINE."
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(140, height - 480, 220, 75, 20);
  ctx.fill();
  ctx.stroke();
  // Bubble pointer
  ctx.beginPath();
  ctx.moveTo(310, height - 405);
  ctx.lineTo(370, height - 365);
  ctx.lineTo(330, height - 405);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#000000";
  ctx.font = 'bold 24px "Anton", "Bebas Neue", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("THIS IS FINE.", 250, height - 435);
}

// 2. "DRAKE" (Nah vs Yeah)
function renderDrake(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  const panelHeight = height / 2;

  // Backgrounds
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, width, height);

  // Split lines
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, panelHeight);
  ctx.lineTo(width, panelHeight);
  ctx.moveTo(width * 0.4, 0);
  ctx.lineTo(width * 0.4, height);
  ctx.stroke();

  // Panel 1: Rejection avatar (Orange coat with hand up)
  ctx.fillStyle = "#ea580c";
  ctx.fillRect(40, 60, width * 0.4 - 80, panelHeight - 120);

  // Rejection head & gesture
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.arc(width * 0.2, 160, 45, 0, Math.PI * 2);
  ctx.fill();
  // Glasses/Beard
  ctx.fillStyle = "#1e1e1e";
  ctx.beginPath();
  ctx.arc(width * 0.2, 175, 45, 0, Math.PI);
  ctx.fill();
  // Disgusted squint
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width * 0.17, 150);
  ctx.lineTo(width * 0.19, 155);
  ctx.moveTo(width * 0.21, 155);
  ctx.lineTo(width * 0.23, 150);
  ctx.stroke();

  // Hand pushing away
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.arc(width * 0.31, 180, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ef4444";
  ctx.font = '900 36px "Anton", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("NAH", width * 0.2, panelHeight - 35);

  // Panel 2: Approval avatar (Pointing finger, big smile)
  ctx.fillStyle = "#ea580c";
  ctx.fillRect(40, panelHeight + 60, width * 0.4 - 80, panelHeight - 120);
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.arc(width * 0.2, panelHeight + 160, 45, 0, Math.PI * 2);
  ctx.fill();
  // Beard
  ctx.fillStyle = "#1e1e1e";
  ctx.beginPath();
  ctx.arc(width * 0.2, panelHeight + 175, 45, 0, Math.PI);
  ctx.fill();
  // Smiling eyes
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width * 0.18, panelHeight + 155, 8, Math.PI, 0);
  ctx.arc(width * 0.22, panelHeight + 155, 8, Math.PI, 0);
  ctx.stroke();
  // Pointing finger hand
  ctx.fillStyle = "#d97706";
  ctx.beginPath();
  ctx.arc(width * 0.31, panelHeight + 175, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#22c55e";
  ctx.font = '900 36px "Anton", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("YEAH", width * 0.2, height - 35);

  // Text on right sides
  drawMemeText(ctx, topText, width * 0.7, panelHeight / 2, width * 0.55, 38);
  drawMemeText(ctx, bottomText, width * 0.7, panelHeight + panelHeight / 2, width * 0.55, 38);
}

// 3. "TWO BUTTONS" (Sweating Guy)
function renderTwoButtons(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  // Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  // Control console on top
  const consoleGrad = ctx.createLinearGradient(0, 0, 0, 360);
  consoleGrad.addColorStop(0, "#334155");
  consoleGrad.addColorStop(1, "#1e293b");
  ctx.fillStyle = consoleGrad;
  ctx.fillRect(60, 50, width - 120, 290);
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 50, width - 120, 290);

  // Two Red Buttons
  // Left Button
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.ellipse(220, 150, 85, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#991b1b";
  ctx.lineWidth = 6;
  ctx.stroke();

  // Right Button
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.ellipse(580, 150, 85, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Button labels
  ctx.fillStyle = "#ffffff";
  ctx.font = 'bold 20px "Anton", sans-serif';
  ctx.textAlign = "center";
  const leftLines = wrapText(ctx, topText, 160);
  leftLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, 220, 225 + i * 24);
  });

  const rightLines = wrapText(ctx, bottomText, 160);
  rightLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, 580, 225 + i * 24);
  });

  // Sweating Guy lower half
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(width / 2, height - 140, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Stressed Eyes
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(width / 2 - 40, height - 165, 24, 0, Math.PI * 2);
  ctx.arc(width / 2 + 40, height - 165, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wide Pupils
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(width / 2 - 40, height - 165, 8, 0, Math.PI * 2);
  ctx.arc(width / 2 + 40, height - 165, 8, 0, Math.PI * 2);
  ctx.fill();

  // Sweating Brow Lines
  ctx.strokeStyle = "#7c2d12";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 80, height - 210);
  ctx.lineTo(width / 2 - 10, height - 195);
  ctx.moveTo(width / 2 + 80, height - 210);
  ctx.lineTo(width / 2 + 10, height - 195);
  ctx.stroke();

  // Giant Sweat Drops
  ctx.fillStyle = "#38bdf8";
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 3;
  // Drop 1
  ctx.beginPath();
  ctx.moveTo(width / 2 - 90, height - 210);
  ctx.quadraticCurveTo(width / 2 - 80, height - 180, width / 2 - 90, height - 170);
  ctx.arc(width / 2 - 95, height - 170, 12, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Drop 2
  ctx.beginPath();
  ctx.moveTo(width / 2 + 75, height - 140);
  ctx.quadraticCurveTo(width / 2 + 85, height - 120, width / 2 + 75, height - 110);
  ctx.arc(width / 2 + 70, height - 110, 10, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Hand with Handkerchief
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(width / 2 - 80, height - 140, 35, 28, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

// 4. "DISTRACTED BOYFRIEND"
function renderDistractedBoyfriend(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  // Street background
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#38bdf8");
  bg.addColorStop(0.5, "#bae6fd");
  bg.addColorStop(0.51, "#94a3b8");
  bg.addColorStop(1, "#475569");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Figure 1: Girl in Red (The temptation) - on left
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(160, height - 60);
  ctx.lineTo(120, height - 340);
  ctx.lineTo(200, height - 340);
  ctx.closePath();
  ctx.fill();
  // Head
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(160, height - 380, 35, 0, Math.PI * 2);
  ctx.fill();

  // Figure 2: The Guy (turning head backwards) - center
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(370, height - 340, 90, 260);
  // Guy Head turned to left
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(390, height - 380, 42, 0, Math.PI * 2);
  ctx.fill();
  // Eyes looking left
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(370, height - 385, 6, 0, Math.PI * 2);
  ctx.fill();
  // Whistling mouth
  ctx.beginPath();
  ctx.arc(360, height - 370, 7, 0, Math.PI * 2);
  ctx.stroke();

  // Figure 3: The Girlfriend (looking offended) - on right
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.moveTo(620, height - 60);
  ctx.lineTo(570, height - 330);
  ctx.lineTo(670, height - 330);
  ctx.closePath();
  ctx.fill();
  // Head
  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(620, height - 370, 36, 0, Math.PI * 2);
  ctx.fill();
  // Shocked angry eyes
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(595, height - 375);
  ctx.lineTo(610, height - 370);
  ctx.moveTo(640, height - 375);
  ctx.lineTo(625, height - 370);
  ctx.stroke();

  // Label bubbles
  // Temptation label (Girl in Red)
  ctx.fillStyle = "#ef4444";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(50, 180, 240, 100, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  drawMemeText(ctx, bottomText, 170, 230, 220, 26);

  // Current duty label (Girlfriend)
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.roundRect(510, 180, 240, 100, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  drawMemeText(ctx, topText, 630, 230, 220, 26);
}

// 5. "PANIK KALM PANIK"
function renderPanikKalm(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  const panelH = height / 3;
  const stages = [
    { title: "PANIK", bg: "#7f1d1d", text: topText, face: "panik" },
    { title: "KALM", bg: "#14532d", text: "EVERYTHING UNDER CONTROL", face: "kalm" },
    { title: "PANIK", bg: "#991b1b", text: bottomText, face: "hyper-panik" },
  ];

  stages.forEach((stage, idx) => {
    const y = idx * panelH;

    ctx.fillStyle = stage.bg;
    ctx.fillRect(0, y, width, panelH);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, y, width, panelH);

    // Text box on left
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 26px "Anton", sans-serif';
    ctx.textAlign = "left";
    const lines = wrapText(ctx, stage.text.toUpperCase(), width * 0.55);
    lines.slice(0, 3).forEach((line, lIdx) => {
      ctx.fillText(line, 30, y + 80 + lIdx * 32);
    });

    // Meme Man Face on right
    const faceX = width * 0.8;
    const faceY = y + panelH / 2;

    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.ellipse(faceX, faceY, 65, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.stroke();

    if (stage.face === "kalm") {
      // Peaceful closed eyes
      ctx.beginPath();
      ctx.arc(faceX - 25, faceY - 15, 14, 0, Math.PI);
      ctx.arc(faceX + 25, faceY - 15, 14, 0, Math.PI);
      ctx.stroke();
      // Gentle calm line mouth
      ctx.beginPath();
      ctx.moveTo(faceX - 20, faceY + 30);
      ctx.lineTo(faceX + 20, faceY + 30);
      ctx.stroke();
    } else {
      // Panik wide eyes & screaming O mouth
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(faceX - 25, faceY - 20, 18, 0, Math.PI * 2);
      ctx.arc(faceX + 25, faceY - 20, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(faceX - 25, faceY - 20, 6, 0, Math.PI * 2);
      ctx.arc(faceX + 25, faceY - 20, 6, 0, Math.PI * 2);
      ctx.fill();
      // Screaming mouth
      ctx.beginPath();
      ctx.ellipse(faceX, faceY + 35, 18, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Badge title
    ctx.fillStyle = "#ffffff";
    ctx.font = '900 24px "Anton", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(stage.title, faceX, y + panelH - 15);
  });
}

// 6. "BUFF DOGE VS CHEEMS"
function renderBuffDoge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  // Split background
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, width / 2, height);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(width / 2, 0, width / 2, height);

  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // LEFT: BUFF CHAD DOGE
  ctx.fillStyle = "#d97706";
  // Muscular chest & torso
  ctx.beginPath();
  ctx.ellipse(200, height - 180, 110, 140, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
  // Huge bicep
  ctx.beginPath();
  ctx.ellipse(90, height - 230, 60, 45, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Doge head
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(200, height - 340, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // RIGHT: WEEPING CHEEMS
  ctx.fillStyle = "#b45309";
  // Slumped small round body
  ctx.beginPath();
  ctx.ellipse(600, height - 140, 75, 65, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Sad little head
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(550, height - 210, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Tear drop
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(530, height - 190, 8, 0, Math.PI * 2);
  ctx.fill();

  // Top and Bottom Texts
  drawMemeText(ctx, topText, 200, 120, 340, 32);
  drawMemeText(ctx, bottomText, 600, 120, 340, 32);
}

// 7. "EXPANDING BRAIN"
function renderExpandingBrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string
) {
  const panelH = height / 2;

  // Panel 1: Small brain
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, panelH);
  ctx.fillStyle = "#ec4899";
  ctx.beginPath();
  ctx.arc(width * 0.75, panelH / 2, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 4;
  ctx.stroke();
  drawMemeText(ctx, topText, width * 0.35, panelH / 2, width * 0.55, 34);

  // Panel 2: Cosmic glowing brain
  const cosmicGrad = ctx.createLinearGradient(0, panelH, width, height);
  cosmicGrad.addColorStop(0, "#083344");
  cosmicGrad.addColorStop(1, "#312e81");
  ctx.fillStyle = cosmicGrad;
  ctx.fillRect(0, panelH, width, panelH);

  // Brain with rays
  ctx.save();
  ctx.translate(width * 0.75, panelH + panelH / 2);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(110, 0);
    ctx.stroke();
  }
  ctx.fillStyle = "#a855f7";
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawMemeText(ctx, bottomText, width * 0.35, panelH + panelH / 2, width * 0.55, 34);

  // Divider
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, panelH);
  ctx.lineTo(width, panelH);
  ctx.stroke();
}

// 8. "MODERN VIRAL CARD"
function renderModernCard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  topText: string,
  bottomText: string,
  triggerLabel: string
) {
  // Sleek Dark Canvas
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#09090b");
  grad.addColorStop(1, "#18181b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Inner elevated card
  ctx.fillStyle = "#18181b";
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(40, 40, width - 80, height - 80, 24);
  ctx.fill();
  ctx.stroke();

  // Author header
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(100, 105, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.font = "bold 24px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("⚡", 100, 113);

  // Names
  ctx.fillStyle = "#fafafa";
  ctx.font = "bold 22px system-ui";
  ctx.textAlign = "left";
  ctx.fillText("Trigger Master", 150, 98);
  ctx.fillStyle = "#71717a";
  ctx.font = "16px system-ui";
  ctx.fillText("@memetrigger · Just now", 150, 122);

  // Trigger Pill Badge
  ctx.fillStyle = "#27272a";
  ctx.beginPath();
  ctx.roundRect(150, 140, Math.min(480, ctx.measureText(triggerLabel).width + 50), 30, 15);
  ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px system-ui";
  ctx.fillText(`TRIGGERED: ${triggerLabel.toUpperCase()}`, 170, 160);

  // Punchline statement
  ctx.fillStyle = "#fafafa";
  ctx.font = '900 36px "Anton", sans-serif';
  const topLines = wrapText(ctx, topText, width - 180);
  topLines.forEach((line, i) => {
    ctx.fillText(line, 90, 230 + i * 42);
  });

  ctx.fillStyle = "#fbbf24";
  ctx.font = '900 38px "Anton", sans-serif';
  const bottomLines = wrapText(ctx, bottomText, width - 180);
  bottomLines.forEach((line, i) => {
    ctx.fillText(line, 90, 240 + (topLines.length * 42) + i * 44);
  });

  // Footer viral stats
  const footerY = height - 90;
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY - 20);
  ctx.lineTo(width - 80, footerY - 20);
  ctx.stroke();

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "15px system-ui";
  ctx.fillText("💬 1.4K      🔁 4.8K      ❤️ 19.2K      📊 342K", 90, footerY + 12);
}

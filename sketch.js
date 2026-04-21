let capture;
let pg; // 泡泡繪圖層
let bubbles = [];
let saveBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.hide();

  // 初始化繪圖層
  updateGraphicsLayer();

  // 建立按鈕
  saveBtn = createButton('SNAP! 擷取畫面');
  styleButton(); // 設置按鈕樣式
  saveBtn.mousePressed(savePhoto);
}

function draw() {
  background('#e7c6ff');

  let imgW = width * 0.6;
  let imgH = height * 0.6;
  let x = (width - imgW) / 2;
  let y = (height - imgH) / 2;

  // 1. 繪製邊框 (稍微比影像大一點點)
  noFill();
  stroke('#ffffff');
  strokeWeight(8);
  rect(x - 5, y - 5, imgW + 10, imgH + 10, 15); // 增加圓角效果

  // 2. 繪製鏡像視訊
  push();
  translate(x + imgW, y);
  scale(-1, 1);
  image(capture, 0, 0, imgW, imgH);
  pop();

  // 3. 處理泡泡層
  pg.clear();
  if (random(1) < 0.15) {
    bubbles.push(new Bubble(pg.width, pg.height));
  }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display(pg);
    if (bubbles[i].isDead()) bubbles.splice(i, 1);
  }
  image(pg, x, y);

  // 4. 動態更新按鈕位置 (放在視訊框下方 20px 處)
  saveBtn.position(width / 2 - saveBtn.width / 2, y + imgH + 30);
}

function updateGraphicsLayer() {
  pg = createGraphics(width * 0.6, height * 0.6);
}

function savePhoto() {
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  let x = (width - imgW) / 2;
  let y = (height - imgH) / 2;
 
  let snapshot = get(x, y, imgW, imgH);
  snapshot.save('creative_capture', 'jpg');
}

function styleButton() {
  saveBtn.style('padding', '10px 20px');
  saveBtn.style('background-color', '#9d4edd');
  saveBtn.style('color', 'white');
  saveBtn.style('border', 'none');
  saveBtn.style('border-radius', '20px');
  saveBtn.style('font-weight', 'bold');
  saveBtn.style('cursor', 'pointer');
}

class Bubble {
  constructor(w, h) {
    this.x = random(w);
    this.y = h + 20;
    this.r = random(4, 12);
    this.speed = random(1, 2.5);
  }
  update() {
    this.y -= this.speed;
    this.x += sin(frameCount * 0.05) * 0.8;
  }
  display(layer) {
    layer.noFill();
    layer.stroke(255, 180);
    layer.strokeWeight(2);
    layer.circle(this.x, this.y, this.r * 2);
    layer.fill(255, 100);
    layer.noStroke();
    layer.circle(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.4);
  }
  isDead() { return this.y < -20; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateGraphicsLayer();
}
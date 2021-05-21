const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext('2d')

function drawImage(ctx, url, callback) {
    let img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = url || ""
    img.onload = () => {
        let scaleX = img.width / canvas.width
        let scaleY = img.height / canvas.height
        ctx.drawImage(img, 0, 0, scaleY > scaleX ? canvas.width / scaleY : canvas.width , scaleY > scaleX ? canvas.height : canvas.height / scaleX)
        if (callback) callback()
    }
    img.onerror = () => {
        if (callback) callback()
    }
}

function drawImageData(imageData) {
    ctx.putImageData(imageData, 0, 0)
}

function getImageData(url) {
    let resolve
    let promise = new Promise(r => resolve = r)
    let newCanvas = document.createElement('canvas')
    newCanvas.width = canvas.width
    newCanvas.height = canvas.height
    let ctx = newCanvas.getContext('2d')
    drawImage(ctx, url, () => {
        resolve(ctx.getImageData(0, 0, newCanvas.width, newCanvas.height))
    })
    return promise
}

// 灰白图像
function toGray(c) {
    for(i = 0; i<c.height; i++){
        for(j = 0; j<c.width; j++){
            let x = (i*4) * c.width + (j*4);
            let r = c.data[x]
            let g = c.data[x+1]
            let b = c.data[x+2]
            c.data[x] = c.data[x+1] = c.data[x+2] = (r+g+b) / 3
        }
    }
    return c
}

//马赛克
function mosaic(imageData, size) {
    for (let i = 0; i < imageData.width; i ++ ) {
        for (let j = 0; j < imageData.height; j ++ ) {
            let r_sum = 0
            let g_sum = 0
            let b_sum = 0
            // 获取 紧随 (i, j) 的 9个像素点
            for (let dx = 0; dx < size; dx++) {
                for (let dy = 0; dy < size; dy++) {
                    let x = i + dx
                    let y = j + dy
                    // (x , y) 坐标
                    let p_px = y * imageData.width + x
                    r_sum += imageData.data[p_px * 4 + 0]
                    g_sum += imageData.data[p_px * 4 + 1]
                    b_sum += imageData.data[p_px * 4 + 2]
                }
            }


            let r_avg = r_sum / (size * size)
            let g_avg = g_sum / (size * size)
            let b_avg = b_sum / (size * size)
            for (let dx = 0; dx < size; dx++) {
                for (let dy = 0; dy < size; dy++) {
                    let x = i + dx
                    let y = j + dy
                    let p_px = y * imageData.width + x
                    imageData.data[p_px * 4 + 0] = r_avg
                    imageData.data[p_px * 4 + 1] = g_avg
                    imageData.data[p_px * 4 + 2] = b_avg
                }
            }
        }
    }
    return imageData
}

function blur(imgData, radius) {

    radius *= 3;    //不知为什么,我的模糊半径是 css中 filter:bulr 值的三倍时效果才一致。

    //Copy图片内容
    let pixes = new Uint8ClampedArray(imgData.data);
    const width = imgData.width;
    const height = imgData.height;
    let gaussMatrix = [],
        gaussSum,
        x, y,
        r, g, b, a,
        i, j, k,
        w;

    radius = Math.floor(radius);
    const sigma = radius / 3;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);

    //生成高斯矩阵
    for (i = -radius; i <= radius; i++) {
        gaussMatrix.push(a * Math.exp(b * i * i));
    }

    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = x + j;
                if (k >= 0 && k < width) {
                    i = (y * width + k) * 4;
                    w = gaussMatrix[j + radius];

                    r += pixes[i] * w;
                    g += pixes[i + 1] * w;
                    b += pixes[i + 2] * w;
                    a += pixes[i + 3] * w;

                    gaussSum += w;
                }
            }

            i = (y * width + x) * 4;
            //计算加权均值
            imgData.data.set([r, g, b, a].map(v=>v / gaussSum), i);
        }
    }

    pixes.set(imgData.data);

    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = y + j;

                if (k >= 0 && k < height) {
                    i = (k * width + x) * 4;
                    w = gaussMatrix[j + radius];

                    r += pixes[i] * w;
                    g += pixes[i + 1] * w;
                    b += pixes[i + 2] * w;
                    a += pixes[i + 3] * w;

                    gaussSum += w;
                }
            }
            i = (y * width + x) * 4;
            imgData.data.set([r, g, b, a].map(v=>v / gaussSum), i);
        }
    }

    return imgData;
}

drawImage(ctx, "./webp.webp")

canvas.onmouseenter = () => {
    getImageData("./webp.webp").then(res => {
        // let imgData = toGray(res)
        // let imgData = mosaic(res, 3)
        let imgData = blur(res, 10)
        drawImageData(imgData)
    })
}

canvas.onmouseleave = () => {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawImage(ctx, "./webp.webp")
}
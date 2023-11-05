const express = require('express');
const app = express();
const PORT = 3000;
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>QRコードリーダー</title>
        </head>
        <body>
            <button id="startCamera">カメラ起動</button>
            <script src="/public/jsqr.js"></script>

            <script>
                const button = document.getElementById('startCamera');
                button.addEventListener('click', () => {
                    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                        .then(stream => {
                            const video = document.createElement('video');
                            document.body.appendChild(video);
                            video.srcObject = stream;
                            video.setAttribute('playsinline', true);
                            video.play();

                            video.onloadedmetadata = () => {
                                video.play();
                                scanQR(video);
                            };
                        })
                        .catch(error => {
                            console.error('カメラへのアクセスに失敗しました:', error);
                        });
                });

                function scanQR(video) {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const scan = () => {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
                        if (qrCode) {
                            console.log('QRコードの値:', qrCode.data);
                            alert('QRコードの値:' + qrCode.data);
                        } else {
                            requestAnimationFrame(scan); // QRコードが検出されるまでスキャンを続ける
                        }
                    };
                    scan();
                }
                
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

const express = require("express");
const got = require("got");
const path = require("path");
const app = express();

app.use(express.json());

// [수정된 부분] 현재 폴더에 있는 파일들을 무조건 우선적으로 보여줍니다.
app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, "public")));

app.post("/confirm", function (req, res) {
    const { paymentKey, orderId, amount } = req.body;
    const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
    const encryptedSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

    got.post("https://api.tosspayments.com/v1/payments/confirm", {
        headers: {
            Authorization: encryptedSecretKey,
            "Content-Type": "application/json",
        },
        json: { orderId, amount, paymentKey },
        responseType: "json",
    })
    .then(response => res.status(response.statusCode).json(response.body))
    .catch(error => res.status(error.response.statusCode).json(error.response.body));
});

// 서버 실행 확인용 문구
app.listen(4242, () => {
    console.log("========================================");
    console.log("인포맥스 서버가 성공적으로 시작되었습니다!");
    console.log("브라우저에서 http://localhost:4242 를 입력하세요.");
    console.log("========================================");
});
require("dotenv").config();

const express = require("express");
const Groq = require("groq-sdk");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// Groq
// ==========================================

const groq = new Groq({

    apiKey: process.env.GROQ_API_KEY

});


// ==========================================
// ตั้งค่า
// ==========================================

app.use(express.json());

app.use(express.static(__dirname));


// ==========================================
// หน้าเว็บไซต์
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// ==========================================
// AI วิเคราะห์ทักษะ
// ==========================================

app.post(
    "/api/analyze-skill",
    async (req, res) => {

        try {

            const skill =
                req.body.skill;


            if (!skill) {

                return res
                    .status(400)
                    .json({

                        error:
                            "กรุณากรอกทักษะ"

                    });

            }


            console.log(
                "กำลังวิเคราะห์:",
                skill
            );


            const completion =
                await groq
                    .chat
                    .completions
                    .create({

                        model:
                            "llama-3.1-8b-instant",


                        messages: [

                            {

                                role:
                                    "system",

                                content: `
คุณเป็น AI ผู้เชี่ยวชาญด้านทักษะ
และการแนะนำอาชีพ

วิเคราะห์ทักษะที่ผู้ใช้กรอก
และแนะนำงานที่มีแนวโน้มเหมาะสม

ตอบเป็นภาษาไทย

ให้ตอบตามรูปแบบ:

🧠 ทักษะที่วิเคราะห์

💼 งานที่มีแนวโน้มเหมาะสม

- งานที่ 1
- งานที่ 2
- งานที่ 3

📌 เหตุผล

อธิบายว่าทำไมทักษะนี้
จึงเหมาะกับงานเหล่านี้

💡 คำแนะนำ

แนะนำทักษะที่ควรพัฒนาเพิ่มเติม

อย่าตัดสินผู้ใช้แบบเด็ดขาด
ให้ใช้คำว่า
"มีแนวโน้มเหมาะสม"
หรือ
"อาจเหมาะกับ"
`

                            },


                            {

                                role:
                                    "user",

                                content:
                                    `ทักษะของผู้ใช้คือ: ${skill}`

                            }

                        ],


                        max_tokens:
                            500

                    });


            const answer =
                completion
                    .choices[0]
                    .message
                    .content;


            console.log(
                "AI ตอบ:",
                answer
            );


            res.json({

                answer:
                    answer

            });


        } catch (error) {


            console.error(
                "Groq Error:",
                error
            );


            res
                .status(500)
                .json({

                    error:
                        error.message ||
                        "ไม่สามารถเชื่อมต่อ AI ได้"

                });

        }

    }
);


// ==========================================
// เปิด Server
// ==========================================

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "=============================="
        );

        console.log(
            "เว็บไซต์เปิดเรียบร้อยแล้ว"
        );

        console.log(
            "http://localhost:3000"
        );

        console.log(
            "=============================="
        );

        console.log("");

    }
);

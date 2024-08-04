const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// route '/'
router.get('/', (req, res) => {
    res.render(__dirname + '/public/index.html');
});

// route '/view/dung'
router.get('/dung', (req, res) => {
    res.sendFile(__dirname + '/public/dung.html');
});

// route '/view/anyquestion'
router.get('/anyquery', (req, res) => {
    res.sendFile(__dirname + '/public/anyquery.html');
});

// route '/view/hurtshere'
router.get('/hurtshere', (req, res) => {
    res.sendFile(__dirname + '/public/hurtshere.html');
});

router.post('/chat', async (req, res) => {
    try {
        let service_gbn_header = req.header('service-gbn');

        let systemMessage = "고마워, 너는 친절하고 자세히 응답해주는 조력자야. ";

        if(service_gbn_header == "aq"){
            systemMessage  += "여러가지 묻는 질문에 쉽게 알아들을수 있도록 자세히 알려줘. ";
        } else if (service_gbn_header == "hh"){
            systemMessage  += "증상이나 몸상태, 건강, 병원 관련 질문에는 이런식으로 알려줘. "
                            + "당신의 증상이 어떤 상태나 질병인것 같다. 그럴때는 어느 병원(진료과목)에 가는것이 좋겠다. 근처의 병원을 추천해주면 더 좋아. "
                            + "그리고 증상이나 몸상태, 건강, 병원과 관련 없는 질문에는 이렇게 답해줘. "
                            + "'몸상태나 증상, 병원과 관련된 질문만 부탁드려요😁' ";
        }

        const userMessage = req.body.message;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userMessage }],
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
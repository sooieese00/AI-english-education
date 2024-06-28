const { getVideoDetails, getVideoCaptions, getChatResponse } = require('../api/youtube');

const fetchLearningExpressions = async (req, res) => {
    const videoId = req.params.videoId;
    const { expressionLevel, expressionNumber } = req.body;

    try {
        // 비디오 세부 정보 가져오기
        const videoDetails = await getVideoDetails(videoId);

        // 자막 가져오기
        const videoCaptions = await getVideoCaptions(videoId);
        if (videoCaptions.length === 0) {
            return res.status(404).send('No captions found for this video.');
        }

        // 자막 텍스트 MongoDB에 저장하기
        const captionId = videoCaptions[0].id;
        const captionText = await getCaptionText(captionId);
        await saveCaption(videoId, captionId, captionText);

         // 저장된 자막 텍스트 가져오기
         const savedCaption = await getCaption(videoId);

        // ChatGPT API에 자막과 설정 전달하여 학습할 표현 가져오기
        const prompt = `
현재 나는 부족한 회화 실력을 높이기 위해서 내가 좋아하는 유튜브 영상에서 나온 표현으로 공부하고 있어.
그리고 너는 나의 영어 회화공부를 도와주는 AI 영어 튜터야. 
내가 공부하고 있는 유튜브 영상의 스크립트를 하단에서 보내줄게. 
그 스크립트에서 활용도가 표현 중에 난이도를 basic, intermediate, advanced, proficient로 나눴을 때 
${expressionLevel}의 난이도에 해당하는 표현 ${expressionNumber}개를 뽑아줘. 
그리고 각 표현의 뜻과 원본 문장, 중요한 포인트, 너가 작성한 새로운 예문과 그 뜻 하나씩 작성해줘.

출력할 데이터 형식:
1. 영어표현 : 뜻
원본 문장: ᄋᄋᄋ 
중요한 포인트: ᄋᄋᄋ
새로운 예문: ᄋᄋᄋ 
새로운 예문 해석: ᄋᄋᄋ

2. 영어표현 : 뜻
원본 문장: ᄋᄋᄋᄋ 
중요한 포인트: ᄋᄋᄋ 
새로운 예문: ᄋᄋᄋ
새로운 예문 해석: ᄋᄋᄋ

스크립트: ${savedCaption.text}
        `;;



        const learningExpressions = await getChatResponse(prompt);

        res.send({ videoDetails, videoCaptions, learningExpressions });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Server error');
    }
};



// 자막 텍스트를 데이터베이스에 저장하는 함수(모듈화 위해 재정의)
const saveCaption = async (videoId, captionId, text) => {
    const newCaption = new Caption({ videoId, captionId, text });
    await newCaption.save();
    console.log('Caption saved:', newCaption);
};

// 데이터베이스에서 자막 텍스트를 가져오는 함수(모듈화 위해 재정의)
const getCaption = async (videoId) => {
    return await Caption.findOne({ videoId });
};

module.exports = { fetchLearningExpressions };

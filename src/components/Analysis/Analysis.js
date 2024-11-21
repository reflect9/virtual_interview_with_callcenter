import {React, useEffect, useState} from 'react';
import _ from 'lodash';

import { executePrompt } from "../../bedrock/BasicPrompt";
import { generateSnapshotImage } from "../../bedrock/ImagePrompt";
import './Analysis.scss';

const Analysis = ({dialogue, startAnalyzing}) => {
    const [question, setQuestion] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

    const query = async (question) => {
        setAnalysisResult('Analyzing...');
		console.log("ANALYZE: " + question);
		const system_part = `아래 답변을 분석하려함. \n`;
		setIsGeneratingAnalysis(true); // 분석중으로 설정
		let analysysResults = [];
		let promiseArray = []; // 모든 페르소나가 질문에 답하면 다음으로 넘어가기 위한 promise 배열
        promiseArray.push(new Promise((resolve, reject) => {
            let dialogues_part = _.map(dialogue.answer, (answer, pID) => {
                return `- ${answer}`;
            }).join('\n');
            let question_part = '\n'+question; 
            let prompt_all = system_part + dialogues_part + question_part; // 전체 대화 준비하기
            console.log(prompt_all);
            executePrompt(prompt_all, undefined, (response) => { // LLM의 응답을 처리하는 callback 함수
                analysysResults.push(response);
                resolve();
            });
        }));
		await Promise.all(promiseArray);
		console.log(analysysResults);
		setAnalysisResult(analysysResults);
		setIsGeneratingAnalysis(false);
		console.log("DONE");
	}

    // 미리 준비한 분석 기능들 (요약하기, 그림으로 표현하기, 키워드 추출하기, 감정 분석하기, 페르소나에게 물어보기)
    let techniques = [{
        "name":"요약하기",
        "prompt": "위 대화의 내용을 종합해서 요약해주세요.",
        "callback": null
    },{
        "name":"그림으로 표현하기",
        "prompt": "개별 참가자의 대답을 Stable Diffusion으로 표현하기 위한 프롬프트를 영어로 작성해주세요.",
        "callback": (name, src) => {
            // 생성된 이미지 표시하기
            console.log(name, src);
        }
    },{
        "name":"키워드 추출하기",
        "prompt": "개별 참가자의 대답에서 주요 내용을 나타내는 키워드를 추출하고, 자주 등장하는 빈도수로 종합해주세요. ",
        "callback": null
    },{
        "name":"감정 분석하기",
        "prompt": "개별 참가자의 대답에서 감정 키워드를 추출하고, 빈도수와 함께 그 이유를 분석해주세요.",
        "callback": null
    },
    ];
    // Ask Question
    // const query = (prompt) => {
    //     let newDialogue = _.clone(dialogue);
    //     newDialogue.analysis = {
    //         "status":"analyzing",
    //         "steps":[]
    //     };
    //     newDialogue.analysis.prompt = prompt;
    //     startAnalyzing(newDialogue);
    // }
    // ANALYSIS CONTENT
    let stepsEl;
    stepsEl = (<ul className="steps">
        <label>STEPS</label>
        {_.map(dialogue.analysis.steps, (step, index) => {
            return (<li>{step}</li>);
        })}
    </ul>);
    // RENDERING
    return (
        <div className="Analysis">
            <div className="paneTitle">위 대화를 분석하는 기능을 제공합니다</div>
            <div className="techniques">
            {_.map(techniques, (technique, index) => {
                return (
                    <div className="technique" key={index} onClick={()=>{
                        setQuestion(technique.prompt);
                    }}>
                        <div className="name">{technique.name}</div>
                    </div>
                );
            })}
            </div>
            <div className="analyticQuestion">
                <input type="text" placeholder="위 대화를 분석하기 위한 프롬프트를 선택 or 입력하고 엔터키를 눌러주세요." value={question} onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        query(e.target.value);
                        e.target.value = '';
                    }
                }}
                onChange={(e)=>{
                    setQuestion(e.target.value);
                }}
                />
            </div>
            <div className="analysisResult">
                {analysisResult}
            </div>
        </div>
    )
}

export default Analysis;
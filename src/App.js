// Importing modules
import React, { useState, useEffect } from "react";
import _, { set } from "lodash";
import './App.scss';

import { v4 } from 'uuid';
import { executePrompt } from "./bedrock/BasicPrompt";
import { generateProfileImage } from "./bedrock/ImagePrompt";
import Interview from "./components/Interview/Interview";
import Interviewee from "./components/Interviewee/Interviewee";
import COG from "./components/COG/COG";
import Personas from "./components/Personas/Personas";

import { GrPowerCycle } from "react-icons/gr";

function App() {
	// State
	const [cog, setCog] = useState({});
	const [personas, setPersonas] = useState({});
	const [personaImages, setPersonaImages] = useState({});
	const [activePersonas, setActivePersonas] = useState({});
	const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false);
	const [isGenereatingDialogues, setIsGeneratingDialogues] = useState(false);
	const [numPersonasToGenerate, setNumPersonasToGenerate] = useState(4);
	const [dialogues, setDialogues] = useState([]);

	// Functions
	const generatePersonas = (cog, numPersonasToGenerate) => {
		setPersonas([]);
		setIsGeneratingPersonas(true);
		const promptForGeneratingPersonas = `Generate ${numPersonasToGenerate} personas for the following COG: 20-30대 한국인 여성 콜센터 상담사.
			Make sure it is in JSON array where each persona contains five keys (name, age, gender, occupation, description). Values must be in English.`;
		executePrompt(promptForGeneratingPersonas, undefined, (response) => {
			let newPersonas = {};
			let newActivePersonas = {};
			try {
				_.forEach(JSON.parse(response), (persona, idx) => {
					persona["uuid"] = v4().slice(0, 5);  // 새로운 페르소나에 UUID를 부여
					newPersonas["P" + (idx + 1)] = persona;
					newActivePersonas["P" + (idx + 1)] = true;
				});
			} catch (e) {
				console.error("Error parsing response: " + e);
				console.log(response);
				return;
			}
			setIsGeneratingPersonas(false);
			setPersonas(newPersonas);
			generatePersonaImages(newPersonas);
			setActivePersonas(newActivePersonas);
		});
	}
	const deselectAllPersonas = () => {
		let newActivePersonas = _.clone(activePersonas);
		_.forEach(Object.keys(newActivePersonas), (pID) => {
			newActivePersonas[pID] = false;
		});
		setActivePersonas(newActivePersonas);
	}
	const selectAllPersonas = () => {
		let newActivePersonas = _.clone(activePersonas);
		_.forEach(Object.keys(newActivePersonas), (pID) => {
			newActivePersonas[pID] = true;
		});
		setActivePersonas(newActivePersonas);
	}
	const generatePersonaImages = async (personas) => {
		let newPersonaImages = _.clone(personaImages);
		let promiseArray = []; // 모든 페르소나 이미지가 생성되면 다음으로 넘어가기 위한 promise 배열
		for (let pID of Object.keys(personas)) {
			let persona = personas[pID];
			promiseArray.push(new Promise((resolve, reject) => {
				generateProfileImage(persona, (persona_uuid, base64Data) => {
					newPersonaImages[persona_uuid] = base64Data;
					resolve();
				});
			}));
		};
		await Promise.all(promiseArray); // 모든 페르소나 이미지가 생성될 때까지 기다림
		console.log("모든 페르소나 이미지가 생성되었습니다.");
		console.log(newPersonaImages);
		setPersonaImages(newPersonaImages);
	}

	const askQuestion = async (question) => {
		console.log("QUESTION: " + question);
		const system_part = `인터뷰 대화임. Claude는 참가자 입장에서 질문에 답할것. \n`;
		setIsGeneratingDialogues(true); // 대화 생성 중임을 알림
		let responseDict = {};
		let promiseArray = []; // 모든 페르소나가 질문에 답하면 다음으로 넘어가기 위한 promise 배열
		for (let pID of Object.keys(personas)) {
			let persona = personas[pID];
			// if (!activePersonas[pID]) continue; // 활성화되지 않은 페르소나는 대화에 참여하지 않음
			promiseArray.push(new Promise((resolve, reject) => {
				let persona_part = "참가자 정보: " + JSON.stringify(persona) + " \n"; // persona를 준비하기 
				let dialogues_part = "";
				for (var dialogue of dialogues) {
					try {
						let answerOfThePersona = dialogue.answer[pID];
						dialogues_part += "진행자:" + dialogue.question + " \n 참가자:" + answerOfThePersona + " \n";
					} catch (e) { }
				} // dialogues에서 이전 대화를 준비하기
				let question_part = "진행자: " + question + " \n 참가자:"; // question을 마지막에 추가하기
				let prompt_all = persona_part + system_part + dialogues_part + question_part; // 전체 대화 준비하기
				console.log(prompt_all);
				executePrompt(prompt_all, undefined, (response) => { // LLM의 응답을 처리하는 callback 함수
					responseDict[pID] = response;
					resolve();
				});
			}));
		}
		await Promise.all(promiseArray); // 모든 페르소나가 질문에 답할 때까지 기다림
		console.log(responseDict);
		setDialogues([...dialogues, { 
			id: v4().slice(0, 5), 	// 대화의 ID를 저장하는 공간
			question: question, 	// 질문을 저장하는 공간
			answer: responseDict,  // 페르소나의 대답을 저장하는 공간 (페르소나 ID를 key로 사용)
			analysis: {} // 해당 대화의 분석 결과를 저장하는 공간
		 }]);
		setIsGeneratingDialogues(false);
		console.log("DONE");
	}
	// UseEffect
	// useEffect(() => {
	// 	generatePersonas(cog, numPersonasToGenerate);
	// },[]);

	// Render
	return (
		<div className="App">
			<header className="App-header">
				<div className="App-title">Virtual Interview with Call Center Employees
					<span className="App-version">ver 1.0</span>
				</div>
				<div className="right-menu">
				</div>
			</header>
			<div className="App-body">
				<div className="section cog">
					<div className="section-title">
						인터뷰 참가자 설정 
						<span className="section-subtitle">
							가상 인터뷰에 참가하는 페르소나의 범위를 설정합니다
						</span>
					</div>
					<div className="section-body">
						<Interviewee cog={cog} setCog={setCog} />
					</div>
				</div>
				<div className="section personas">
					<div className="section-title">
						PERSONAS
						<span className="section-subtitle">
							위 설정에 맞는 페르소나를 &nbsp;
							<input type="number" value={numPersonasToGenerate} className="numPersonasToGenerate" onChange={(e) => {
								e.preventDefault();
								if (e.target.value > 20) e.target.value = 20;
								setNumPersonasToGenerate(e.target.value);
							}} />
							개 생성합니다 &nbsp;
							<GrPowerCycle className={(isGeneratingPersonas) ? "buttonGeneratePersona gear" : "buttonGeneratePersona"}
								onClick={() => generatePersonas(cog, numPersonasToGenerate)} />
						</span>
						<div className="section-utils">
							<label className="selectNone" onClick={deselectAllPersonas}>
								Deselect All
							</label>
							<label className="selectAll" onClick={selectAllPersonas}>
								Select All
							</label>
						</div>
					</div>
					<div className="section-body">
						<Personas personas={personas} personaImages={personaImages} activePersonas={activePersonas} setActivePersonas={setActivePersonas} generatePersonas={generatePersonas} />
					</div>
				</div>
				<div className="section personas">
					<div className="section-columns">
						<div className="subsection-column interview">
							<div className="subsection-title">
								INTERVIEW
								<button className="minimal reset-interview"
									onClick={() => {
										setDialogues([]);
									}}>
									Reset Dialogue
								</button>
							</div>
							<div className="subsection-body">
								<Interview
									dialogues={dialogues}
									setDialogues={setDialogues}
									personas={personas}
									personaImages={personaImages}
									askQuestion={askQuestion}
									activePersonas={activePersonas}
									isGenereatingDialogues={isGenereatingDialogues} />
							</div>
						</div>
						<div className="subsection-column analysis">
							<div className="subsection-title">

							</div>

						</div>
					</div>

				</div>
			</div>
		</div>
	);
}

export default App;
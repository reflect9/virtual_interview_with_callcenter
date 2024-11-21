import {React, useEffect, useState} from 'react';
import _, { set } from 'lodash';

import './Interview.scss';
import Analysis from '../Analysis/Analysis';
import { GrPowerCycle } from "react-icons/gr";
import { BsQuestionCircleFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";

const Interview = ({dialogues, setDialogues, personas, personaImages, askQuestion, activePersonas, isGenereatingDialogues}) => {
    const startAnalyzing = (dID) => {
        let newDialogues = _.clone(dialogues);
        let dialogueToAnalyze = _.find(newDialogues, (d) => {
            return d.id === dID;
        });
        dialogueToAnalyze.analysis = {
            "status":"analyzing",
            "steps":[]
        };
        setDialogues(newDialogues);
    }
    
    return (
        <div className="Interview">
            <div className="Interview-body">
                <div className="dialogues">
                    {_.map(dialogues, (dialogue, index) => {
                        let sortedPersonaIDs = _.keys(dialogue.answer).sort();
                        let filteredPersonaIDs = _.filter(sortedPersonaIDs, (pID) => {
                            return activePersonas[pID];
                        });
                        // Composing the dialogue
                        return (
                            <div key={index} className="dialogue">
                                <div className="question">
                                    <span className="bubble">
                                        {dialogue.question}
                                        <TiDelete className="deleteQuestion" 
                                            onClick={()=>{
                                                let newDialogues = _.clone(dialogues);
                                                newDialogues.splice(index, 1);
                                                setDialogues(newDialogues);
                                            }}
                                        />
                                    </span>
                                    
                                </div>
                                <div className="answers">
                                    {_.map(filteredPersonaIDs, (pID) => {
                                        return (
                                            <div key={pID} className="answer">
                                                <div className="persona">
                                                    {/* <div className="name">{personas[pID].name}</div> */}
                                                    <div className="profile_image">
                                                        <img src={personaImages[personas[pID].uuid]} alt="persona" />
                                                    </div>
                                                </div>
                                                <div className="bubble">
                                                    {dialogue.answer[pID]}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <Analysis dialogue={dialogue} startAnalyzing={startAnalyzing} />
                            </div>
                        )
                    })}
                    {isGenereatingDialogues &&
                        <div className="spinner_generatingDialogue">
                            <GrPowerCycle className="gear" /> 대화를 생성중입니다. 조금만 기다려 주세요.
                        </div>
                    }
                </div>
                <div className="newQuestion">
                    <input type="text" placeholder="질문을 입력하세요" onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            askQuestion(e.target.value);
                            e.target.value = '';
                        }
                    }}/>
                </div>
            </div>
        </div>
    )
}

export default Interview;
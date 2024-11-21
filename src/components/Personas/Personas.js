import {React, useEffect, useState} from 'react';
import _ from 'lodash';

import './Personas.scss';
import { GrPowerCycle } from "react-icons/gr";

const Personas = ({personas, personaImages, activePersonas, setActivePersonas}) => {
    let elPersonas;
    const toggleActivePersonas = (index) => {
        let newActivePersonas = _.clone(activePersonas);
        newActivePersonas[index] = !newActivePersonas[index];
        setActivePersonas(newActivePersonas);
    }
    if (personas.length === 0) {
        elPersonas = (
            <div className="empty">
                Oops! 현재 생성된 페르소나가 없습니다 
            </div>
        )
    } else {
        elPersonas = _.map(personas, (persona, index) => {
            let className = "persona";
            if(activePersonas[index] === true) className += " active";
            return (
                <div key={index} className={className}>
                    <div className="persona-image" onClick={(e)=>{
                        toggleActivePersonas(index);
                    }}>
                        {personaImages[persona.uuid] === undefined && <GrPowerCycle className="gear"/>}
                        {personaImages[persona.uuid] && <img src={personaImages[persona.uuid]} alt="persona" />}
                        </div>
                    <div className="persona-info">
                        <div className="infoblock name">
                            {(activePersonas[index] === true)? (<div className="online">ONLINE</div> ):(<div className="online">&nbsp;</div>)}
                            {persona.name} 
                        </div>
                        <div className="infoblock age">
                            {persona.age} yrs old {persona.gender}
                        </div>
                        <div className="infoblock occupation">
                            {persona.occupation}
                        </div>
                    </div>
                </div>
            );
        });
    }
    
    return (
        <div className="Personas">
            {elPersonas}
        </div>
    )
}

export default Personas;
import {React, useEffect, useState} from 'react';
import _ from 'lodash';

import sample_groups from "./SampleInterviewee.json";
import './Interviewee.scss';

const Interviewee = ({cog, setCog}) => {
    return (
        <div className="Interviewee">
            <div className="sample_groups">
                {_.map(sample_groups.groups, (group, idx) => {
                    return (<button key={idx} className="group"
                        onClick={(e)=>{
                            setCog({
                                "persona_description": group.description
                            });
                        }}
                    >
                        {group.id}
                        </button>);
                })}
            </div>
            <textarea id="interviewee_description" onChange={(e)=>{
                setCog({
                    "persona_description": e.target.value
                });
            }} value={cog.persona_description}></textarea>
        </div>
    );
}

export default Interviewee;
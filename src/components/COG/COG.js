import {React, useEffect, useState} from 'react';
import _ from 'lodash';

import './COG.scss';

const COG = ({cog}) => {
    return (
        <div className="COG">
            <div className="criteria">
                <div className="COG-section-title">선정 기준</div>
                {_.map(cog.cog, (criterion, index) => {
                    return (
                        <div key={index} className="criterion">
                            {/* <span className="category">
                                {criterion[0]}
                            </span> */}
                            <span className="description">
                                {criterion[1]}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="persona_description">
                {cog.persona_description}
            </div>
            <div className="persona_keywords">
                {_.map(cog.persona_keyword_detail, (description, keyword) => {
                    return (
                        <div key={keyword} className="keyword">
                            <span className="keyword">
                                {keyword.replace("[공통] ","")}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default COG;
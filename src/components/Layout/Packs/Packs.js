import React from 'react';

import SelectModuls from "./steps/SelectModuls";
import RegisterForm from "./steps/RegisterForm";



function Packs(props) {
    const [current , setCurrent] = React.useState(0);

    const steps = [
        {
            content: <SelectModuls current={current}  setCurrent={setCurrent} />
        },
        {
            content: <RegisterForm current={current}  setCurrent={setCurrent} />
        },
        {
            content: <div>Payment</div>
        },
    ];

    return (
        <div className="content">
           <div className="packs">
               <div className="stepdots">
                   <div onClick={()=>{setCurrent(0)}} className={`dot ${current === 0 ?  'active': ' ' }`}></div>
                   <div onClick={()=>{setCurrent(1)}} className={`dot ${current === 1  ? 'active': ' ' }`}></div>
                   <div onClick={()=>{setCurrent(2)}} className={`dot ${current === 2  ? 'active': ' ' }`}></div>
               </div>
               <div className="steps-content">{steps[current].content}</div>
           </div>
        </div>
    );
}

export default Packs;

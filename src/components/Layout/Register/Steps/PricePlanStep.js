import React from 'react';
import { Radio } from 'antd';
function PricePlanStep(props) {
    return (
        <div className='animated zoomIn border mt-15 mb-15'>
            <div className="p-2 ">
                <Radio.Group size='large' className='price-radios' defaultValue="a" buttonStyle="solid">
                    <Radio.Button className='mr5-15' value="a">Sadə</Radio.Button>
                    <Radio.Button className='mr5-15' value="b">Orta</Radio.Button>
                    <Radio.Button className='mr5-15' value="c">Mürəkkəb</Radio.Button>
                </Radio.Group>
            </div>
        </div>
    );
}
export default PricePlanStep;

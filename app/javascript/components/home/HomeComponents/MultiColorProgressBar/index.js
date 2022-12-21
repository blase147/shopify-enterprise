import { Card } from '@shopify/polaris';
import React from 'react';
import "./multipleProgess.css";

const MultiColorProgressBar = (props) => {
    const readings = [
        {
            name: '< 15 years old',
            value: 12,
            color: '#017EFA'
        },
        {
            name: '20 - 35 years old',
            value: 43,
            color: '#FD1F9B'
        },
        {
            name: '40 - 50 years old',
            value: 20,
            color: '#007AB5'
        },
        {
            name: '> 50 years old',
            value: 8,
            color: '#FF0000'
        }
    ]

    let bars = readings && readings.length && readings.map(function (item, i) {
        if (item.value > 0) {
            return (
                <div className="bar" style={{ 'backgroundColor': item.color, 'width': item.value + '%' }} key={i}>

                </div>
            )
        }
    }, this);

    let legends = readings && readings.length && readings.map(function (item, i) {
        if (item.value > 0) {
            return (
                <>
                    <Card.Section>
                        <div className='channel_summary' key={i}>
                            <div className="label">{item.name}</div>
                            <div className='visitors'>45 visitors</div>
                            <div className='precentage'>{item?.value}%</div>
                        </div>
                    </Card.Section>
                </>
                // <div className="legend" key={i}>
                //     <span className="dot" style={{ 'color': item.color }}>●</span>
                //     <span className="label">{item.name}</span>
                // </div>
            )
        }
    }, this);

    return (
        <div className="multicolor-bar">
            <div className="bars">
                {bars == '' ? '' : bars}
            </div>
            <div className="legends">
                {legends == '' ? '' : legends}
            </div>
        </div>
    );
}

export default MultiColorProgressBar;
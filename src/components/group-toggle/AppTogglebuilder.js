import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function AppTogglebuilder(props) {
    let { data , formikProp } = props;

    const handleFormat = (header, value) => {
        formikProp.setValues(prevValues => {
            const updatedValues = {
                ...prevValues,
                [header]: prevValues[header]?.includes(value)
                    ? prevValues[header].filter(item => item !== value)
                    : [...(prevValues[header] || []), value],
            };
    
            if (updatedValues[header].length === 0) {
                delete updatedValues[header];
            }
    
            return updatedValues;
        });
    };

    function Headerformatter(header){
        let originalArray = header.split("_")
        const newArray = originalArray.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }).join(" ")
        return newArray
    }
    
    return (
        <div>
            <h2>Permission</h2>
            {data.map(item => (
                <>
                <h2>{Headerformatter(item.header)}</h2>
                {item.modules.map(subitem=>(
                    <div key={subitem.header}>
                    <h4>{Headerformatter(subitem.header)}</h4>

                    <ToggleButtonGroup
                        value={formikProp.values[subitem.value] || []}
                        onChange={(event, value) => handleFormat(subitem.value, event.target.value,event)}
                        aria-label={`text formatting for ${subitem.header}`}
                        name={subitem.value}
                    >
                        {subitem.options.map(value => (
                            <ToggleButton key={value} value={value} aria-label={value}>
                                {value}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
                ))}
                </>
            ))}
            {/* {data.map(item => (
                <div key={item.header}>
                    <h3>{Headerformatter(item.header)}</h3>
                    <ToggleButtonGroup
                        value={formikProp.values[item.header] || []}
                        onChange={(event, value) => handleFormat(item.header, event.target.value,event)}
                        aria-label={`text formatting for ${item.header}`}
                        name={item.header}
                    >
                        {item.options.map(option => (
                            <ToggleButton key={option.value} value={option.value} aria-label={option.name}>
                                {option.name}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
            ))} */}
        </div>
    );
}

export default AppTogglebuilder;

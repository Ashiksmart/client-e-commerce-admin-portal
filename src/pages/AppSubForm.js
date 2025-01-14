import React, { useEffect, useState } from 'react';
import { Button, TextField, Checkbox, Autocomplete, Stack, Box } from '@mui/material';

const CheckBoxOutlineBlankIcon = <span className="MuiSvgIcon-root" />;
const CheckBoxIcon = <span className="MuiSvgIcon-root" />;

export default function AppSubForm(props) {
  const { selectbox, Multiselectbox, section, islive } = props;
  const [loading, setloading] = useState(true);
  const [sectiondata, setsectiondata] = useState([]);

  useEffect(() => {
    console.log("eeeeeeeeeeeeeeeeeeeeeeee", section)
    if (section.length === 0) {
      section.push({});
    }
    setsectiondata(section);
    return () => {
      setsectiondata([]);
    };

  }, [section, section.length]);

  const remove = async (index) => {
    let liveData = sectiondata.filter((_, i) => i !== index);
    setsectiondata(liveData);
  };

  const add = async () => {
    await setloading(false);
    await props.addData()
    await setloading(true);
  };
  const save = async () => {

    let finalarr = []
    for (let i = 0; i < sectiondata.length; i++) {
      let obj = {}
      const element = sectiondata[i];
      if (Object.keys(element).length > 0 && element.values.length > 0) {
        obj["autocompleteValue"] = element.autocompleteValue
        obj["values"] = element.values
        finalarr.push(obj)
      }
    }
    if (finalarr.length === sectiondata.length) {
      props.finalResult(finalarr)
      console.log(finalarr, "sectiondatasectiondatasectiondata", sectiondata)
    } else {
      console.log(finalarr, "validation errr", "sectiondatasectiondatasectiondata", sectiondata)
    }

  };

  const setAutocompleteValue = async (index, newValue) => {
    await setloading(false);
    let updatedData = sectiondata;
    updatedData[index].autocompleteValue = newValue;
    updatedData[index].values = []; // Reset the multiselect values
    console.log(updatedData, sectiondata, "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", index)
    setsectiondata(updatedData);
    await setloading(true);
  };

  const handleSelectChange = (index, newValue) => {
    let updatedData = [...sectiondata];
    console.log(newValue, "newValuenewValuenewValuenewValuenewValuenewValuenewValue");
    updatedData[index].values = newValue;
    setsectiondata(updatedData);
  };

  return (
    <Box sx={{
      padding: 2,
      overflow: "auto",
      height: "100%"
    }}>
      <Stack sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 3,
      }}>
        <div style={{ width: "80%", height: "20px" }}>
        </div>
        <Button sx={{
          width: "20%"
        }} type="button" onClick={() => add()}>
          Add
        </Button>
      </Stack>

      {loading && (
        <>
          {sectiondata.map((mapdata, i) => (
            <Stack key={i} className='crm_fld_box'>

              <Box className="crm_fld_lft" sx={{
                flexDirection: "column"
              }}>
                <Autocomplete
                  value={mapdata.autocompleteValue}
                  onChange={(event, newValue) => {
                    props.getMultiselectValue(newValue, i);
                    setAutocompleteValue(i, newValue);
                  }}
                  inputValue={mapdata.name || ''}
                  onInputChange={(event, newInputValue) => {
                    setsectiondata((prevData) => {
                      const updatedData = [...prevData];
                      updatedData[i].name = newInputValue;
                      return updatedData;
                    });
                  }}
                  id={`controllable-states-demo-${i}`}
                  options={selectbox}
                  renderInput={(params) => <TextField {...params} label="Attribute Group" />}
                />
                <Autocomplete
                  multiple
                  key={`multiselect-${i}`}
                  value={mapdata.values}
                  onChange={(event, newValue) => {
                    handleSelectChange(i, newValue);
                  }}
                  id={`checkboxes-tags-demo-${i}`}
                  options={mapdata.Multiselectbox !== undefined ? mapdata.Multiselectbox : []}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={CheckBoxOutlineBlankIcon}
                        checkedIcon={CheckBoxIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Values" placeholder="Values" />
                  )}
                />
              </Box>
              <Box className="crm_fld_rgt">
                {sectiondata.length !== 1 && (
                  <Button type="button" onClick={() => remove(i)}>
                    Remove
                  </Button>
                )}
              </Box>
            </Stack>
          ))}
        </>
      )}
      <Button type="button" onClick={() => save()}>
        Save
      </Button>
    </Box>
  );
}

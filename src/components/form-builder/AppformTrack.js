import React, { useState, useMemo, useEffect } from "react";
import { Typography, Box, ButtonGroup } from "@mui/material";
import Iconify from "../iconify";
import { TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from '@mui/material/IconButton';

const AppformTrack = React.forwardRef((props, ref) => {
  const {
    formikProp,
    formConfig,
    handleFileUpload,
    imageList,
    action,
    data,
    mode,
    CheckParent,
  } = props;
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  React.useImperativeHandle(ref, () => ({}));
  const { state } = useLocation();
  return (
    <>
      {data.map((section, i) => {
        return (
          <Box
            sx={{
              width: "100%",
              marginBottom: 5,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            {(section.link_type == undefined ||
              section.link_type == "" ||
              (section.link_type != undefined &&
                section.link_type == "parent")) && (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      marginBottom: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Status"
                      variant="outlined"

                      value={section.display_name}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Step"
                      variant="outlined"
                      value={section.priority}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    {section.link_type != undefined &&
                      section.link_type == "parent" &&
                      CheckParent(section, "child") && (
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<Iconify icon="basil:add-solid" />}
                          onClick={() => {
                            action(section, mode.SUB_ADD);
                          }}
                        >
                          Add Sub Flow
                        </Button>
                      )}
                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "15px"
                    }}>
                      <ButtonGroup
                        disableElevation
                        variant="contained"
                        aria-label="Disabled elevation buttons"
                        size='small'
                        sx={{
                          overflow: 'hidden'
                        }}
                      >
                        <Button
                          type="submit"
                          // disabled={query.get("type") == "client" && section.default_status === "Y" ? true : false}
                          variant="contained"
                          startIcon={<Iconify icon="tabler:edit" />}
                          onClick={() => {
                            action({ ...section, index: i }, mode.EDIT);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="submit"
                          disabled={state.type == "client" && section.default_status === "Y" ? true : false}
                          variant="contained"
                          startIcon={<Iconify icon="ic:baseline-delete" />}
                          onClick={() => {
                            action({ ...section, index: i }, mode.DELETE);
                          }}
                        >
                          {" "}
                          Remove
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Box>

                </>
              )}

            {data.map((section_child, i) => {
              return (
                <>
                  {section_child.link_type != undefined &&
                    section_child.link_type == "child" && section_child.link_to == section.status_name && (
                      <Box
                        sx={{
                          width: "100%",
                          marginTop: 3,
                          marginLeft: 3,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: "20px",
                          flexWrap: 'wrap',
                          paddingLeft: "20px"
                        }}
                      >
                        <TextField
                          id="outlined-basic"
                          label="Status"
                          variant="outlined"
                          value={section_child.display_name}
                          disabled
                          sx={{
                            width: "30%"
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Step"
                          variant="outlined"
                          value={section_child.priority}
                          disabled
                          sx={{
                            width: "30%"
                          }}
                        />
                        <Box>
                          {/* <Button
                            type="submit"
                            variant="contained"
                            onClick={() => {
                              action({ ...section_child, index: i }, mode.EDIT);
                            }}
                          >
                          </Button>
                          <Button
                            type="submit"
                            variant="outlined"
                            startIcon={<Iconify icon="ic:baseline-delete" />}
                            onClick={() => {
                              action({ ...section_child, index: i }, mode.DELETE);
                            }}
                          >
                          </Button> */}
                          <IconButton color="primary" aria-label="Edit" onClick={() => {
                            action({ ...section_child, index: i }, mode.EDIT);
                          }}>
                            <Iconify icon="tabler:edit" />
                          </IconButton>
                          <IconButton color="primary" aria-label="Edit" onClick={() => {
                            action({ ...section_child, index: i }, mode.DELETE);
                          }}>
                            <Iconify icon="ic:baseline-delete" />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                </>
              );
            })}
          </Box>
        );
      })}
      <Box>
        {CheckParent(data[data.length - 1], "parent") && (
          <Button
            type="submit"
            variant="contained"
            startIcon={<Iconify icon="basil:add-solid" />}
            onClick={() => {
              action(undefined, mode.ADD);
            }}
          >
            Add
          </Button>
        )}
      </Box>
    </>
  );
});
export default AppformTrack;

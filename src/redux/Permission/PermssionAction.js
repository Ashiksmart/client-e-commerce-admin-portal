import * as actions from './PermssionType';

export const SetPermission = data => {
    return {
        type: actions.SETPERMISSION,
        payload: data
    }
}

export const SetSCREEN = data => {
    let Screen = []
    data.forEach(element => {
        let newObj = {
            header : element.label,
            show_on_market : element.show_on_market,
            is_default: element.is_default,
            modules : element.children.map((e)=>{
                 if (e.operation.permission == "Y") {
                return {
                    header:e.label,
                    value:`${element.process}_${e.value}`,
                    options:e.operation.operation
                }
                 }
            }).filter((elm)=>elm)
        }
        if(newObj.modules.length > 0){
            Screen.push(newObj)
        }
       
    });
    return {
        type: actions.ALLSCREEN,
        payload: Screen
    }
}

export const getAllpermission = (data) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      try {
        let Screen = [];
        data.forEach((element) => {
          element.children.forEach((e) => {
                let arrange_data = e.operation.operation.map((elm) => {
                    return `${element.process}_${e.value}:${elm}`;
                  });
                  Screen = [...Screen, ...arrange_data];
          });
        });
        resolve(Screen);
      } catch (error) {
        reject(error);
      }
    });
  };
};
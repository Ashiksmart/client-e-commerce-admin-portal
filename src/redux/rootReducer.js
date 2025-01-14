import { combineReducers } from 'redux'
import DataReducer  from './DynamicData/DataReducer'
import PermssionReducer  from './Permission/PermssionReducer'
import { persistReducer } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
   key: 'root',
   storage,
   transforms: [
      encryptTransform({
        secretKey: 'ytrewqiopgfdsa',
        onError: function (error) {
          // Handle the error.
          console.log("Persist Err :" , error)
        },
      }),
    ],
 }

const rootReducer = combineReducers({
   Dynamicdata:DataReducer,
   permisson:persistReducer(persistConfig,PermssionReducer)
})
export default rootReducer;
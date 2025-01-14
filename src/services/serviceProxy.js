import ServiceProxy from 'b2b-service-proxy'
import Constants from '../constants'
import Interceptor from '../interceptors/interceptor'
import {ACCOUNT_INFO} from '../constants/localstorage'
let serviceProxy = new ServiceProxy(Constants, Interceptor)

export default serviceProxy

let account_data=serviceProxy.localStorage.getItem(ACCOUNT_INFO)
if(account_data===null || account_data===undefined || account_data===""){
    Constants.ACCOUNT_ID=""
}else{
    Constants.ACCOUNT_ID=account_data.account
}


export let serviceProxyUpdate =()=>{
    serviceProxy = new ServiceProxy(Constants, Interceptor)
}


import ServiceProxy from "../services/serviceProxy";
import { ACCOUNT_INFO } from "../constants/localstorage";

let color_data = ServiceProxy.localStorage.getItem(ACCOUNT_INFO)

export const setColors = () => {
    document.documentElement.style.setProperty('--prim', color_data != "" && color_data.info != undefined ? color_data.info?.primay_color : "#3a6bff")
    document.documentElement.style.setProperty('--second', color_data != "" && color_data.info != undefined ? color_data.info?.secondary_color : "#1540c0")
    document.documentElement.style.setProperty('--white', "#ffffff")
    document.documentElement.style.setProperty('--black', "#000000")
}
import {nanoid} from "@reduxjs/toolkit";
const isDebugging = true;
const APPLICATION_URL = "http://localhost:8080";

const REQUEST_NUMBER = 5;
const IDLE_TIMEOUT_MINUTES = 180;

export const getIdleTimeoutMinutes = () => {
    return IDLE_TIMEOUT_MINUTES;
}

export const getRequestNumber = () => {
    return REQUEST_NUMBER;
}

export const getApplicationUrl = () => {
    return APPLICATION_URL;
}

export const isDebuggingMode = () => {
    return isDebugging;
}

export const getUniqueKey = () => {
    return nanoid();
}

export const onlyAlphabeticalCheck = (value) => {
    const re = /^[a-zA-Z \b]+$/;
    if (value === '' || re.test(value)) {
        return value;
    } else {
        return value.replaceAll(/[^a-zA-Z ]/gi, "");
    }
}

export const emailRegexCheck = (value) => {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (re.test(value)) return true;
    else return false;
}

export const byteaToBase64 = (bytea) => {
    return "data:image/png;base64," + (bytea);
}

export const printResponseData = (requestName, responseData) => {
    if (isDebugging) {
        console.log(requestName + " response: ", responseData);
    }
}

export const printErrorMessage = (requestName, err) => {
    if (isDebugging) {
        console.log("Error inside " + requestName + ". Error message: ", err);
    }
}
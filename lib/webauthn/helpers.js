import base64url from "base64url";

/**
 * Converts PublicKeyCredential into serialised JSON
 * @param  {Object} pubKeyCred
 * @return {Object}            - JSON encoded publicKeyCredential
 */
export const publicKeyCredentialToJSON = (pubKeyCred) => {
    if(pubKeyCred instanceof Array) {
        let arr = [];

        for(let i of pubKeyCred)
            arr.push(publicKeyCredentialToJSON(i));
        
        return arr;
    }

    if(pubKeyCred instanceof ArrayBuffer) {
        return base64url.encode(pubKeyCred);
    }

    if(pubKeyCred instanceof Object) {
        let obj = {};

        for (let key in pubKeyCred) {
            obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
        }

        return obj;
    }

    return pubKeyCred;
}
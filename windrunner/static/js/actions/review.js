import ajax, {
    jsonToString,
    getRealUrl
} from 'utils/request';

export function getFaceVerifyResult(params) {
    return ajax('GET', '/face_verify_result', params);
}

export function getFaceCompareResult(params) {
    return ajax('GET', '/face_compare_result', params);
}

export function getOcrResult(params) {
    return ajax('GET', '/ocr_result', params);
}

//导出接口
export function exportResult(url, params) {
    params.limit = 10000;
    const str = jsonToString(params);
    return getRealUrl(url + '?' + str);

}



// WEBPACK FOOTER //
// ./src/actions/review.js
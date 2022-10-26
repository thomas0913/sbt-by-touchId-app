export const STORING_USERNAME = "STORING_USERNAME";

export const storingUsername = (data) => {
    return {
        type: STORING_USERNAME,
        username_detail: data
    }
}
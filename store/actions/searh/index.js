
export const updateSearchKeyword = (payload) => {
    return (dispatch) => {
        dispatch({
            type: 'Update_Search_Keyword',
            payload: payload,
        });
    }
}

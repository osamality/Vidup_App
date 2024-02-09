
const initialState = {
    searchKeyword: '',
    recentSearches: []
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'Update_Search_Keyword':
            return {
                ...state,
                searchKeyword: action.payload
            }
        case 'Update_Recent_Searches':
            return {
                ...state,
                recentSearches: action.payload
            }
        case 'CLEAR_SEARCH':
            return {
                ...initialState
            }
        default:
            return state;
    }
}

export default searchReducer;
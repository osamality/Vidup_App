
const initialState = {
    deviceOrientation: 'portrait'
};

const globalChecks = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_ORIENTATION':
            return {
                ...state,
                deviceOrientation: action.payload
            };
        default:
            return state;
    }
}

export default globalChecks;
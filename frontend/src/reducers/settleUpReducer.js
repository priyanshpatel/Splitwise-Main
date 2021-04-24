let initialState = {
    data: null,
}

let settleUp = (state = initialState, action) => {
    let newState = { ...state }
    // console.log( newState );
    switch (action.type) {
        case "settle_up_success":
            newState.data = action.payload.data
            newState.message = "Settle up successful";
            return newState;
        case "settle_up_failed":
            newState.error = true;
            newState.message = "Settle up failed"
            return newState;

        default:
            return newState;
    }
}

export default settleUp
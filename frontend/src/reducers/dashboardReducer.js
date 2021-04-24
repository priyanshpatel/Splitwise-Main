let initialState = {
    totalBalance: null,
    totalYouOwe: null,
    totalYouAreOwed: null,
    youOweList: [],
    youAreOwedList: [],
}

let dashboard = (state = initialState, action) => {
    let newState = { ...state }
    // console.log( newState );
    switch (action.type) {
        case "get_dashboard_success":
            newState.totalBalance = action.payload.totalBalance
            newState.totalYouOwe = action.payload.totalYouOwe
            newState.totalYouAreOwed = action.payload.totalYouAreOwed
            newState.youOweList.push(action.payload.response.youOweList)
            newState.youAreOwedList.push(action.payload.response.youAreOwedList)
            newState.message = "Get dashboard successful";
            return newState;
        case "get_dashboard_failed":
            newState.error = true;
            newState.message = "Failed getting dashboard"
            return newState;

        default:
            return newState;
    }
}

export default dashboard
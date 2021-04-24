let initialState = {
    newGroup: {},
    updateFlag: false,
    data: null,
}

let group = (state = initialState, action) => {
    let newState = { ...state }
    // console.log( newState );
    switch (action.type) {
        case "create_group_success":
            newState.newGroup = action.payload.response
            newState.updateFlag = true;
            newState.message = "New group created";
            return newState;
        case "create_group_failed":
            newState.error = true;
            newState.message = "Failed creating new group"
            return newState;
        case "add_expense_success":
            newState.data = action.payload.data
            newState.message = "Expense added successfully";
            newState.updateFlag = true;
            return newState;
        case "add_expense_failed":
            newState.data = action.payload.data
            newState.message = "Add expense failed";
            return newState;
        default:
            return newState;


    }
}

export default group
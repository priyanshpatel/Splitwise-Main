let initialState = {
    profile: {},
    updateFlag: false,
}

let profile = (state = initialState, action) => {
    let newState = { ...state }
    // console.log( newState );
    switch (action.type) {
        case "update_profile_success":
            newState.profile = action.payload.response
            newState.updateFlag = true;
            newState.message = "Profile updated";
            return newState;
        case "update_profile_failed":
            newState.error = true;
            newState.message = "Failed updating profile"
            return newState;
        case "get_profile_success":
            newState.profile = action.payload.response
            newState.updateFlag = true;
            newState.message = "Get profile successful";
            return newState;
        case "get_profile_failed":
            newState.error = true;
            newState.message = "Get profile failed"
            return newState;
        default:
            return newState;


    }
}

export default profile
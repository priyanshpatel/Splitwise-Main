let initialState = {
    type: "",
    userId: "",
}

let login = (state = initialState, action) => {
    let newState = { ...state }
    // console.log( newState );
    switch (action.type) {
        case "user_login_success":
            // newState.type = "users"
            newState.userId = action.payload.response._id
            newState.error = false;
            newState.message = "Login Success";
            return newState;
        case "user_login_failed":
            newState.error = true;
            newState.message = "Invalid credentials!"
            return newState;
        default:
            return newState;
    }
}

export default login
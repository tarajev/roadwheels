import React from "react";

// TODO - Da se odradi context kako treba

const AuthorizationContext = React.createContext({
    APIUrl: "http://localhost:5000/",
    contextUser: {
        id: "",
        name: "",
        email: "",
        role: 0,
        jwtToken: "",
    },
    contextSetUser: () => { },
});

export default AuthorizationContext;

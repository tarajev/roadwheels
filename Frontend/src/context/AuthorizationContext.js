import React from "react";

// TODO - Da se odradi context kako treba

const AuthorizationContext = React.createContext({
    APIUrl: "http://localhost:5000/",
    contextUser: {
        id: "",
        name: "",
        email: "",
        role: "Guest",
        jwtToken: "",
        country: null, // samo za employee
        city: null,    // samo za employee
    },
    contextSetUser: () => { },
});

export default AuthorizationContext;

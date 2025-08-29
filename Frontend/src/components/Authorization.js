import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Unauthorized from "../views/Unauthorized";
import AuthorizationContext from "../context/AuthorizationContext";
import Permissions from "./Permissions";

const Authorization = ({ requiredPermissions }) => {
  const { contextUser } = useContext(AuthorizationContext);

  if (!contextUser || contextUser.role === "Guest") {
    return <Unauthorized />;
  }

  const userPermissions = Permissions[contextUser.role] || [];

  const isAllowed = requiredPermissions.some((perm) =>
    userPermissions.includes(perm)
  );

  return isAllowed ? <Outlet /> : <Unauthorized />;
};

export default Authorization;
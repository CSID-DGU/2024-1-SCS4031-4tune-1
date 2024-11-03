import { user } from "@/types/user";
import React from "react";
import UserCard from "./UserCard";

type UserSectionProps = {
  users: user[];
};

const UserSection = ({ users }: UserSectionProps) => {
  return (
    <div>
      {users.map((user) => (
        <UserCard user={user} />
      ))}
    </div>
  );
};

export default UserSection;

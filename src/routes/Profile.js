import { collection, getDocs, query, where } from "@firebase/firestore";
import { authService, dbService } from "fbase";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyIgnites = async () => {
    const collectionQuery = query(
      collection(dbService, "ignites"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(collectionQuery);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyIgnites();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};

export default Profile;

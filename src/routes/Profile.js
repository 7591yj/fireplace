import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { dbService, authService } from "fbase";
import Ignite from "components/Ignite";
import "css/Profile.css";

const Profile = ({ userObj }) => {
  const [ignites, setIgnites] = useState([]);

  const getMyIgnites = async () => {
    const collectionQuery = query(
      collection(dbService, "ignites"),
      where("creatorId", "==", userObj.uid)
    );

    const querySnapshot = await getDocs(collectionQuery);
    const igniteArray = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setIgnites(igniteArray);
  };

  useEffect(() => {
    return () => {
      getMyIgnites();
    };
  }, [getMyIgnites()]);

  const photoURL = authService.currentUser.photoURL;

  return (
    <>
      <div className="profileIntro">
        <img src={photoURL} alt="Profile" className="profileImg" />
        <h2>{userObj.displayName}</h2>
      </div>
      <h3>My Ignites: </h3>
      <div>
        {ignites.map((ignite) => (
          <Ignite
            key={ignite.id}
            igniteObject={ignite}
            isOwner={ignite.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Profile;

import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Ignite from "components/Ignite";
import IgniteFac from "components/IgniteFac";

const Home = ({ userObj }) => {
  const [ignites, setIgnites] = useState([]);

  useEffect(() => {
    const collectionQuery = query(
      collection(getFirestore(), "ignites"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(collectionQuery, (querySnapshot) => {
      const igniteArray = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setIgnites(igniteArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <IgniteFac userObj={userObj} />
      <div>
        {ignites.map((ignite) => (
          <Ignite
            key={ignite.id}
            igniteObject={ignite}
            isOwner={ignite.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState, useRef } from "react";
import Ignite from "components/Ignite";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [ignite, setIgnite] = useState("");
  const [ignites, setIgnites] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    // 실시간으로 데이터를 데이터베이스에서 가져오기
    const collectionQuery = query(
      collection(getFirestore(), "ignites")
      // query here. e.g.) where('text', '==', 'hehe')
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

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentURL = await getDownloadURL(response.ref);
    }

    const igniteObj = {
      text: ignite,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    };

    try {
      const docRef = await addDoc(collection(dbService, "ignites"), igniteObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log("Error while adding document: ", error);
    }

    setIgnite("");
    setAttachment("");
    fileInput.current.value = "";
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setIgnite(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const _file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(_file);
  };

  const fileInput = useRef();

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = "";
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={ignite}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Ignite" />
        {attachment && (
          <div>
            <img
              src={attachment}
              width="50px"
              height="50px"
              alt="Attached file"
            />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
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

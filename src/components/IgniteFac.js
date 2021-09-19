import React, { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { storageService, dbService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const IgniteFac = ({ userObj }) => {
  const [ignite, setIgnite] = useState("");
  const [attachment, setAttachment] = useState("");

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
  );
};

export default IgniteFac;

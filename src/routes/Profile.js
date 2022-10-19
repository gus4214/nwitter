import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const Profile = ({ userObj }) => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const getMyNweets = async () => {
    // dbService의 컬렉션 중 "nweets" Docs에서 userObj의 uid와 동일한
    // creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );

    // getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChange = (e) => {
    const { value } = e.target;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;

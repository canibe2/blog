import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useParams } from 'react-router-dom';

//Component 유저 화면
export default function UserPage() {

//State :  이미지 파일 인풋 참조
const imageInputRef = useRef<HTMLInputElement | null>(null);


//State : 마이페이지 여부
const { userEmail }= useParams();

//Component : 유저화면 상단
const UserTop = () => {

//State : 마이페이지 여부
const [isMyPage, setMyPage] = useState<Boolean>(true);

//State : 닉네임 변경 여부
const [isNicknameChange, setNicknameChange] = useState<Boolean>(false);

//State : 닉네임
const [nickname, setNickname] = useState<string>('');

//State : 변경 닉네임 
const [changeNickname, setChangeNickname] = useState<string>('');

//State : 프로필 이미지
const [profileImage, setProfileImage] = useState<string | null>(null);

const nicknameInputRef = useRef<HTMLInputElement | null>(null);

//Event Handler 프로필 이미지 클릭 이벤트
const onProfileBoxClickHandler = () => {
  if(!isMyPage) return;
  if(!imageInputRef.current) return;
  imageInputRef.current.click();
};

//Event Handler : 닉네임 수정 버튼 클릭 이벤트
const onNicknameEditButtonClickHandler = () => {
  setChangeNickname(nickname);
  setNicknameChange(!isNicknameChange);
};

//Event Handler  프로필 이미지 변경 이벤트
const onProfileImageChangeHandler = (event : ChangeEvent<HTMLInputElement>) =>{
  if(!event.target.files || !event.target.files.length) return;

  const file = event.target.files[0];

  const data = new FormData();

  data.append('file',file);
};

//Event Handler 닉네임 변경 이벤트
const onNicknameChangerHandler = (event : ChangeEvent<HTMLInputElement>) => {
  const {value} = event.target;

  if(value.length > 8) {
    alert('닉네임은 최대8자 까지만 입력할 수 있습니다.');
    return;
  }

  setChangeNickname(value);
}


//Effect : email path variable 변경 시 실행
useEffect(() => {

    if(!userEmail) return;
    setNickname('키린');
    setProfileImage('https://i.pinimg.com/236x/31/db/0e/31db0e1e70d1b273f0146516a784723a.jpg');

    },[userEmail]);

useEffect(() => {
  if(isNicknameChange && nicknameInputRef.current) {
    nicknameInputRef.current.focus();

    const len = nicknameInputRef.current.value.length;
    nicknameInputRef.current.setSelectionRange(len,len);
  }
},[isNicknameChange]);

    //Render 상단
    return(
        <div id='user-top-wrapper'>
          <div className='user-top-container'>
            {isMyPage ?
            <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
              {profileImage !== null ?
              
              <div className='user-top-profile-image' style={{backgroundImage:`url(${profileImage})`}}></div> :
                  <div className='icon-box-large'>
                    <div className='icon image-box-white-icon'></div>
                  </div>
              }
              <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}} onChange={onProfileImageChangeHandler}/>
            </div> :
            <div className='user-top-profile-image-box' style={{backgroundImage:`url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
            }
            <div className='user-top-info-box'>
              <div className='user-top-info-nickname-box'>
                {isMyPage ?
                <>
                {isNicknameChange ?
                <input ref={nicknameInputRef} className='user-top-info-nickname-input' type='text' size={changeNickname.length + 2} value={changeNickname} onChange={onNicknameChangerHandler}/> :
                <div className='user-top-info-nickname'>{nickname}</div>
                }
                <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                  <div className='icon edit-icon'></div>
                </div>
                </> :
                <div className='user-top-info-nickname'>{nickname}</div>
                }
              </div>
              <div className='user-top-info-email'>{'ftts55@naver.com'}</div>
            </div>
          </div>
        </div>
      );
    
  };

  //Component : 유저화면 하단
  const UserBottom = () => {
    //Render 하단
    return(
        <div></div>
      );
    
  };

  //Render
  return (
    <>
    <UserTop/>
    <UserBottom/>
    </>
  )
}

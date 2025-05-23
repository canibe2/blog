import React, { useEffect, useRef, useState } from 'react';
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
const [isMyPage, setMyPage] = useState<Boolean>(false);

//State : 닉네임 변경 여부
const [isNicknameChange, setNicknameChange] = useState<Boolean>(false);

//State : 닉네임
const [nickname, setNickname] = useState<string>('');

//State : 변경 닉네임 
const [changeNickname, setChangeNickname] = useState<string>('');

//State : 프로필 이미지
const [profileImage, setProfileImage] = useState<string | null>(null);



//Effect : email path variable 변경 시 실행
useEffect(() => {

    if(!userEmail) return;
    setNickname('키린');
    setProfileImage('https://i.pinimg.com/236x/31/db/0e/31db0e1e70d1b273f0146516a784723a.jpg');

    },[userEmail]);


    //Render 상단
    return(
        <div id='user-top-wrapper'>
          <div className='user-top-container'>
            {isMyPage ?
            <div className='user-top-my-profile-image-box'>
              {profileImage !== null ?
              
              <div className='user-top-profile-image' style={{backgroundImage:`url(${profileImage})`}}></div> :
              <div className='user-top-my-profile-image-nothing-box'>
                  <div className='icon-box-large'>
                    <div className='icon image-box-white-icon'></div>
                  </div>
                </div>
              }
              <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}}/>
            </div> :
            <div className='user-top-profile-image-box' style={{backgroundImage:`url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
            }
            <div className='user-top-info-box'>
              <div className='user-top-info-nickname-box'>
                {isMyPage ?
                <>
                {isNicknameChange ?
                <input className='user-top-info-nickname-input' type='text' size={changeNickname.length + 1} value={changeNickname}/> :
                <div className='user-top-info-nickname'>{nickname}</div>
                }
                <div className='icon-button'>
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

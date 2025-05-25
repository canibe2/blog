import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { AUTH_PATH, BOARD_PATH, MAIN_PATH } from 'constants/index';
import { BOARD_WRITE_PATH } from 'constants/index';
import { USER_PATH } from 'constants/index';
import { useLoginUserStore } from 'stores';
import { fileUploadRequest, getUserBoardListRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'apis/response/user';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'apis/request/user';
import { useCookies } from 'react-cookie';
import { usePagination } from 'hooks';
import { GetUserBoardListResponseDto } from 'apis/response/board';
import Pagination from 'components/Pagination';

//Component 유저 화면
export default function UserPage() {

//State : 마이페이지 여부
const { userEmail }= useParams();

//State : cookie
const [cookies,setCookie] = useCookies();

//State : 로그인 유저
const { loginUser } = useLoginUserStore();

//State : 유저이메일 path variable
const [isMyPage, setMyPage] = useState<Boolean>(true);

//Function : 네비게이트
const navigate = useNavigate();

//Component : 유저화면 상단
const UserTop = () => {

//State :  이미지 파일 인풋 참조
const imageInputRef = useRef<HTMLInputElement | null>(null);

//State : 닉네임 변경 여부
const [isNicknameChange, setNicknameChange] = useState<Boolean>(false);

//State : 닉네임
const [nickname, setNickname] = useState<string>('');

//State : 변경 닉네임 
const [changeNickname, setChangeNickname] = useState<string>('');

//State : 프로필 이미지
const [profileImage, setProfileImage] = useState<string | null>(null);

const nicknameInputRef = useRef<HTMLInputElement | null>(null);

//Function : get user response
const getUserResponse = (responseBody : GetUserResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const {code} = responseBody;
  if(code==='NU') alert('존재하지 않는 유저입니다.');
  if(code === 'DBE') alert('데이터베이스 오류입니다.');
  if(code !== 'SU'){
    navigate(MAIN_PATH());
    return;
  }

  const {email,nickname,profileImage} = responseBody as GetUserResponseDto;
  setNickname(nickname);
  setProfileImage(profileImage);
  const isMyPage = email === loginUser?.email;
  setMyPage(isMyPage);
};

//Function : file upload response
const fileUploadResponse = (profileImage : string | null) => {
  if(!profileImage) return;
  if(!cookies.accessToken) return;

  const requestBody : PatchProfileImageRequestDto ={profileImage};
  patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
};

//Function : patch profile image response
const patchProfileImageResponse = (responseBody : PatchProfileImageResponseDto | ResponseDto | null) => {

  if(!responseBody) return;
  const {code} = responseBody;
  if(code==='AF') alert('인증에 실패하였습니다.');
  if(code ==='NU') alert('존재하지 않는 유저입니다.');
  if(code ==='DBE') alert('데이터베이스 오류입니다.');
  if(code !== 'SU') return;

  if(!userEmail) return;
  getUserRequest(userEmail).then(getUserResponse);
};

//Function : patch nickname response
const patchNicknameResponse = (responseBody : PatchNicknameResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const {code} = responseBody;
  if(code ==='VF') alert('닉네임은 필수입니다.');
  if(code ==='AF') alert('인증에 실패했습니다');
  if(code ==='DN') alert('중복되는 닉네임입니다.');
  if(code ==='NP') alert('권한이 없습니다.');
  if(code ==='NU') alert('존재하지 않는 유저입니다.');
  if(code ==='DBE') alert('데이터베이스 오류입니다.');
  if(code !=='SU') return;

  if(!userEmail) return;
  getUserRequest(userEmail).then(getUserResponse);
  setNicknameChange(false);
}

//Event Handler 프로필 이미지 클릭 이벤트
const onProfileBoxClickHandler = () => {
  if(!isMyPage) return;
  if(!imageInputRef.current) return;
  imageInputRef.current.click();
};

//Event Handler : 닉네임 수정 버튼 클릭 이벤트
const onNicknameEditButtonClickHandler = () => {
  if(!isNicknameChange) {
    setChangeNickname(nickname);
    setNicknameChange(!isNicknameChange);
    return;
  }
  if(!cookies.accessToken) return;
    const requestBody : PatchNicknameRequestDto ={
      nickname : changeNickname
    };
    patchNicknameRequest(requestBody,cookies.accessToken).then(patchNicknameResponse);
  };



//Event Handler  프로필 이미지 변경 이벤트
const onProfileImageChangeHandler = (event : ChangeEvent<HTMLInputElement>) =>{
  if(!event.target.files || !event.target.files.length) return;

  const file = event.target.files[0];

  const data = new FormData();

  data.append('file',file);

  fileUploadRequest(data).then(fileUploadResponse);
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

    getUserRequest(userEmail).then(getUserResponse);

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

//State : 게시물 개수
const [count,setCount] = useState<number>(2);

//State : 페이지네이션
const { currentPage, currentSection, viewList, viewPageList, totalSection,
          setCurrentPage, setCurrentSection, setTotalList
} = usePagination<BoardListItem>(5);

/* //State 게시물 리스트
const [userBoardList,setUserBoardList] = useState<BoardListItem[]>([]); */

//Function : get user board list reponse
const getUserBoardListResponse = (responseBody : GetUserBoardListResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const {code} = responseBody;
  
  if(code ==='NU'){
    alert('존재하지 않는 유저입니다.');
    navigate(MAIN_PATH());
    return;
  }
  if(code ==='DBE') alert('데이터베이스 오류입니다.');
  if(code !=='SU') return;

  const { userBoardList} = responseBody as GetUserBoardListResponseDto;
  setTotalList(userBoardList);
  setCount(userBoardList.length);
}

//Event Handler : 사이드 카드 클릭 이벤트
const onSideCardClickHandler = () => {
  if(isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
  
  else if(loginUser) navigate(USER_PATH(loginUser.email));

};

//Effect : 유저이메일 path variable 변경 시 실행
useEffect(() => {

    if(!userEmail) return;
    getUserBoardListRequest(userEmail).then(getUserBoardListResponse);


    },[userEmail]);

    //Render 하단
    return(
        <div id='user-bottom-wrapper'>
          <div className='user-bottom-container'>
          <div className='user-bottom-title'>{isMyPage ? '내가올린 게시물 ' : '게시물 '}<span className='emphasis'>{count}{'개'}</span></div>
          <div className='user-bottom-contents-box'>
            {count === 0 ?
            <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div> :
            <div className='user-bottom-contents'>
              {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
            </div>
            }
            <div className='user-bottom-side-box'>
            <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
              <div className='user-bottom-side-container'>
                {isMyPage ?
              <>
                <div className='icon-box'>
                  <div className='icon edit-icon'></div>
                </div>
                <div className='user-bottom-side-text'>{'글쓰기'}</div>
                </>:
                <>
                <div className='user-bottom-side-text'>{'내 게시물로 가기'}</div>
                <div className='icon-box'>
                  <div className='icon arrow-right-icon'></div>
                </div>
                </>
                }
              </div>
            </div>
          </div>
        </div>
          <div className='user-bottom-pagination-box'>
                {count !== 0 &&
                <Pagination
                  currentPage={currentPage}
                  currentSection={currentSection}
                  setCurrentPage={setCurrentPage}
                  setCurrentSection={setCurrentSection}
                  viewPageList={viewPageList}
                  totalSection={totalSection}
                />
                }
          </div>
        </div>
      </div>
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

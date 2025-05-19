import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constants/index';
import { useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore } from 'stores';
import path from 'path';
import BoardDetail from 'views/Board/Detail';
import { fileUploadRequest, patchBoardRequest, postBoardRequest } from 'apis';
import { PatchBoardRequestDto, PostBoardRequestDto } from 'apis/request/board';
import { PatchBoardResponseDto, PostBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';

//Component 헤더 레이아웃
export default function Header() {

  //State 로그인 유저 상태
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();

  //State path 상태
  const { pathname } = useLocation();

  //State cookie 상태
  const [cookies, setCookie] = useCookies();

  //State 로그인 상태
  const [isLogin, setLogin] = useState<boolean>(false);
  //State 인증 페이지
  const [isAuthPage, setAuthPage] = useState<boolean>(false);
  //State 메인 페이지
  const [isMainPage, setMainPage] = useState<boolean>(false);
  //State 검색 페이지
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  //State 게시물 상세 페이지
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  //State 게시물 작성 페이지
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  //State 게시물 수정 페이지
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  //State 유저 페이지
  const [isUserPage, setUserPage] = useState<boolean>(false);


//Function 네비게이트 함수
const navigate = useNavigate();

//Event Handler  로고 클릭 이벤트
const onLogoClickHandler = () => {
  navigate(MAIN_PATH());
}

//Component 검색 버튼
const SearchButton = () => {

  //State 검색 버튼 요소 참조상태
  const searchButtonRef = useRef<HTMLDivElement | null>(null);

  //State 검색 버튼 상태
  const [status, setStatus] = useState<boolean>(false);
  //State 검색 상태
  const [word, setWord] = useState<string>('');
  //State 검색어 path variable 상태
  const {searchWord} = useParams();

  //Event handler 검색어 변경 이벤트
  const onSearchWordChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWord(value);
  };

  //Event handler 검색어 키 이벤트
  const onSearchWordKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!searchButtonRef.current) return;
    searchButtonRef.current.click();
  };
  //Event handler 검색 버튼 클릭 이벤트 처리
  const onSearchButtonClickHandler = () => {

    if(!status) {
      setStatus(!status);
      return;
    }
    navigate(SEARCH_PATH(word));
  };

  //Effect 검색 path variable 변경 될때마다 실행
  useEffect(() => {
      if(searchWord) {
        setWord(searchWord);
        setStatus(true);

  }
  }, [searchWord]);
  
  if(!status)
    //Render 검색 버튼 false 상태
    return (
    <div className='icon-button' onClick={onSearchButtonClickHandler}>
      <div className='icon search-light-icon'></div>
    </div>
    );
    //Render 검색 버튼 true 상태
    return (
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} 
        onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
        <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
};

//Component 로그인 또는 마이페이지
const MyPageButton = () => {

  //State userEmail path variable
  const {userEmail} = useParams();

  //Event handler  마이페이지 버튼 이벤트
  const onMyPageButtononClickHandler = () => {
    if(!loginUser) return;
    const { email } = loginUser;
    navigate(USER_PATH(email));
  };
  //Event handler  마이페이지 버튼 이벤트
    const onSignOutButtononClickHandler = () => {
      resetLoginUser();
      setCookie('accessToken', '',{path:MAIN_PATH(), expires : new Date()});
      navigate(MAIN_PATH());
    };

  //Event handler 로그인 버튼 이벤트
  const onSignInButtonClickHandler = () => {
    navigate(AUTH_PATH());
  };

  if (isLogin && userEmail === loginUser?.email)
  //Render 로그아웃 버튼
  return <div className='white-button' onClick={onSignOutButtononClickHandler}>{'로그아웃'}</div>
  
  if(isLogin)
  //Render 마이 페이지 버튼
  return <div className='white-button' onClick={onMyPageButtononClickHandler}>{'마이페이지'}</div>
  //Render 로그인 버튼 
  return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
};

//Component 업로드 버튼
const UploadButton = () => {

  //State 게시물 번호 path variable 
  const { boardNumber } = useParams();

  //State 게시물 상태 
  const {title, content, boardImageFileList, resetBoard} = useBoardStore();

  //Function post board response
  const postBoardResponse = (responseBody : PostBoardResponseDto | ResponseDto | null) => {
    if(!responseBody)

      return;

      const { code } = responseBody;

      if(code === 'DBE')
        alert('데이터베이스 오류입니다.');

      if(code === 'AF' || code === 'NU')
        navigate(AUTH_PATH());
    
      if(code === 'VF')
        alert('제목과 내용은  필수입니다.');
      
      if (code === 'SU') {

        resetBoard();
        if (!loginUser)

          return;

          const { email } = loginUser;

          navigate(USER_PATH(email));
}
      
    }

    //Function patch board response
    const patchBoardResponse = (responseBody : PatchBoardResponseDto | ResponseDto | null) => {
      
      if(!responseBody) return;
  
        const { code } = responseBody;
  
        if(code === 'DBE')
          alert('데이터베이스 오류입니다.');
  
        if(code === 'AF' || code === 'NU' || code ==='NB' || code === 'NP')
          navigate(AUTH_PATH());
      
        if(code === 'VF')
          alert('제목과 내용은  필수입니다.');
        
        if (code === 'SU') {

        if(!boardNumber) return;

          navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
        }
    }



  //Event handler 업로드 버튼 클릭 이벤트
  const onUploadButtononClickHandler = async () => {
    const accessToken = cookies.accessToken;
    
    if(!accessToken)
      return;

    const boardImageList : string[] = [];

    for(const file of boardImageFileList){
      const data = new FormData();
      data.append('file',file);
      
      const url = await fileUploadRequest(data);

      if(url) boardImageList.push(url);
    }

    const isWriterPage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();

    if(isWriterPage) {

      const requestBody : PostBoardRequestDto = {

        title,content, boardImageList
    }

    const response = await postBoardRequest(requestBody, accessToken);

    postBoardResponse(response);

  } else {

    if (!boardNumber)
      return;
    
    const requestBody : PatchBoardRequestDto = {
      title, content, boardImageList
    }
    const response = await patchBoardRequest(boardNumber, requestBody  , accessToken);
    
    patchBoardResponse(response);
  }

  }

  if(title && content)

  return <div className='black-button' onClick={onUploadButtononClickHandler}>{'업로드'}</div>
    //Render 업로드 불가 버튼
  return <div className='disable-button'>{'업로드'}</div>
};

// Effect path가 변경 될때마다 실행 될 함수
useEffect(() => {

  const isAuthPage = pathname.startsWith(AUTH_PATH());
  setAuthPage(isAuthPage);

  const isMainPage = pathname === MAIN_PATH();
  setMainPage(isMainPage);

  const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
  setSearchPage(isSearchPage);

  const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
  setBoardDetailPage(isBoardDetailPage);

  const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
  setBoardWritePage(isBoardWritePage);

  const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
  setBoardUpdatePage(isBoardUpdatePage);
  
  const isUserPage = pathname.startsWith(USER_PATH(''));
  setUserPage(isUserPage);
}, [pathname]);

// Effect loginUser가 변경 될때마다 실행 될 함수
useEffect(() => {
  setLogin(loginUser !== null);
},[loginUser])

//Render 레이아웃
    return (
    <div id='header'>
        <div className='header-container'>
            <div className='header-left-box' onClick={onLogoClickHandler}>
              <div className='icon-box'>
                <div className='icon logo-dark-icon'></div>
              </div>
              <div className='header-logo'>{'Kirin Blog'}</div>
            </div>
              <div className='header-right-box'>
                {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton/>}
                {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <MyPageButton/>}
                {(isBoardWritePage || isBoardUpdatePage) && <UploadButton/>}
              </div>
        </div>
      </div>
  )
};

import React, { useEffect, useState } from 'react';
import './App.css';
import BoardItem from 'components/BoardItem';
import { commentListMock, favoriteListMock, latestBoardListMock, top3BoardListMock } from 'mocks';
import Top3Item from 'components/Top3Item';
import CommentItem from 'components/CommentItem';
import FavoriteItem from 'components/FavoriteItem';
import InputBox from 'components/InputBox';
import Footer from 'layouts/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Search from 'views/Search';
import Authentication from 'views/Authentication';
import UserP from 'views/User';
import BoardDetail from 'views/Board/Detail';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/Container';
import { AUTH_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, BOARD_DETAIL_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constants/index';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';

//Component Application
function App() {

//State 로그인유저 전역상태
const { setLoginUser, resetLoginUser}= useLoginUserStore();

//State cookie 상태
const [cookies,setCookie]  =  useCookies();

//Function getSignInUserResponse 처리
const getSignInUserResponse = (responseBody : GetSignInUserResponseDto | ResponseDto | null) => {

  if(!responseBody) return;

  const{code}= responseBody;

  if(code === 'AF' || code === 'NU' || code === 'DBE'){
    resetLoginUser();
    return;
  }
  const loginUser : User = {...responseBody as GetSignInUserResponseDto };
  setLoginUser(loginUser);
}

//Effect access Token cookie 값이 변경 될 때 마다 실행
useEffect(() => {
  if(!cookies.accessToken) {

    resetLoginUser();
    return;
  }

  getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);

},[cookies.accessToken]);

  const [value, setValue] = useState<string>('');
//Render
//Description 메인화면 : '/' - Main
//Description 로그인 + 회원가입 화면 : '/auth' - Authentication
//Description 검색화면 : '/search/:searchWord' - Search
//Description 유저 페이지 : '/user/:userEmail' - User
//Description 게시물 상세보기 : '/board/detail/:boardNumber' -BoardDetail
//Description 게시물 작성하기 : '/board/write' - boardWrite
//Description 게시물 수정하기 : '/board/update/:boardNumber' - BoardUpdate

return (
  <>

<Routes>
        <Route element={<Container/>}>
      <Route path={MAIN_PATH()} element={<Main />} />
      <Route path={AUTH_PATH()} element={<Authentication />} />
      <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
      <Route path={USER_PATH(':userEmail')}element={<UserP />} />
      <Route path={BOARD_PATH()}>
        <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
        <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
        <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
      </Route>
        <Route path='*' element={<h1>404 Not Found</h1>}/>
      </Route>
    </Routes>

{/* <div style={{display : 'flex', justifyContent:'center', gap:'24px'}}>
        {top3BoardListMock.map(Top3ListItem => <Top3Item key={Top3ListItem.boardNumber} top3ListItem ={Top3ListItem}/>)}
      </div> */}

  </>
)
};

export default App;

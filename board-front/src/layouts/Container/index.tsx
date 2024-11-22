import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import Footer from 'layouts/Footer';
import Header from 'layouts/Header';
import { AUTH_PATH } from 'constants/index';


//Component 레이아웃
export default function Container() {

    //State 현재 페이지 path name 상태
    const { pathname } = useLocation();


  //Render
    return (
        <>
            <Header/>
               <Outlet/> 
               {pathname !== AUTH_PATH() && <Footer/> }
            
        </>
  )
}

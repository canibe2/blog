import React from 'react';
import './style.css';

//Component
export default function Footer() {

    //Event handler : 인스타 아이콘 버튼 클릭 이벤트
    const onInstaIconButtonClickHandler = () => {
        window.open('https://www.instagram.com');
    }
   //Event handler : 네이버 블로그 아이콘 버튼 클릭 이벤트
   const onNaverBlogIconButtonClickHandler = () => {
    window.open('https://blog.naver.com');
}

//Render
  return (

    <div id="footer">
    <div className="footer-container">
        <div className="footer-top">
            <div className="footer-logo-box">
                <div className="icon-box">
                    <div className="icon logo-light-icon"></div>
                </div>
                <div className="footer-logo-text">Kirin's Blog</div>
            </div>
            <div className="footer-link-box">
                <div className="footer-email-link">{'rivayne91@gmail.com'}</div>
                <div className="icon-button" onClick={onInstaIconButtonClickHandler}>
                    <div className="icon insta-icon"></div>
                </div>
                <div className="icon-button" onClick={onNaverBlogIconButtonClickHandler}>
                    <div className="icon naver-blog-icon"></div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <div className="footer-copyright">{'Copyright Kirin. ⓒ 2024 All Rights Reserved.'} </div>
        </div>
    </div>
</div>
 )
}

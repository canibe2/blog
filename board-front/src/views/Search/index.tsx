import React from 'react';
import './style.css';

//Component 게시물 검색 화면
export default function Search() {
  //Render
  return (
    <div id='search-wrapper'>
        <div className='search-conatiner'>
          <div className='search-title-box'>
            <div className='search-title'></div>
            <div className='search-count'></div>
          </div>
          <div className='search-contents-box'></div>
          <div className='search-pagination-box'></div>
        </div>
    </div>
  )
}

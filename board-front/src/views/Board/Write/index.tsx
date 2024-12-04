import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { useBoardStore } from 'stores';

//Component 게시물 작성
export default function BoardWrite() {

  //State 본문 영역 요소 참조
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  //State 이미지 입력 요소 참조
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  //State 게시물 상태
  const { title,setTitle } = useBoardStore();
  const { content,setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList} = useBoardStore();
  const { resetBoard } = useBoardStore();

  //State 게시물 이미지 미리보기 URL
  const [imageUrls,setImageUrls] = useState<string[]>([]);

  //Effect mount 실행
  useEffect(() => {
    resetBoard();
  },[]);


  //Render
  return (
    <div id='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>
          <div className='board-write-title-box'>
            <input className='board-write-title-input' type='text' placeholder='제목을 작성해주세요.' value={title}/>
          </div>
          <div className='divider'></div>
          <div className='board-write-content-box'>
            <textarea ref={contentRef} className='board-write-content-textarea' style={{resize:'none'}} placeholder='본문을 작성해주세요.' value={content}/>
            <div className='icon-button'>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}}/>
          </div>
          <div className='board-write-images-box'>
            <div className='board-write-image-box'>
              <img className='board-write-image'/>
              <div className='icon-button image-close'>
                <div className='icon close-icon'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useBoardStore, useLoginUserStore } from 'stores';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { MAIN_PATH } from 'constants/index';
import { Cookies, useCookies } from 'react-cookie';
import { getBoardRequest } from 'apis';
import { GetBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { convertUrlsToFile } from 'utils';

//Component 게시물 수정
export default function BoardWrite() {

  //State 제목 영역 요소 참조
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  //State 본문 영역 요소 참조
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  //State 이미지 입력 요소 참조
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  //State 게시물 번호 path variable
  const { boardNumber } = useParams();

  //State 로그인 유저
  const { loginUser } = useLoginUserStore();

  //State 게시물 상태
  const { title,setTitle } = useBoardStore();
  const { content,setContent } = useBoardStore();
  const { boardImageFileList, setBoardImageFileList} = useBoardStore();
  
  //State 로그인 유저 상태
  // const { loginUser } =  useLoginUserStore();

  //State cookie 상태
  const [cookies,setCookies] = useCookies();

  //State 게시물 이미지 미리보기 URL
  const [imageUrls,setImageUrls] = useState<string[]>([]);

  //Function Navigate
  const navigator = useNavigate();

  //Function get board response
  const getBoardResponse = (responseBody : GetBoardResponseDto | ResponseDto | null) => {

      if(!responseBody)
            return;
    
          const  { code } = responseBody;
    
          if(code === 'NU')
            alert("존재하지 않는 게시물입니다.");
          if(code === 'DBE')
            alert("데이터베이스 오류입니다.");
          if(code !== 'SU') {
            navigator(MAIN_PATH());
            return;
        }

        const { title, content, boardImageList, writerEmail } = responseBody as GetBoardResponseDto;
        setTitle(title);
        setContent(content);
        setImageUrls(boardImageList);
        convertUrlsToFile(boardImageList).then(boardImageFileList => setBoardImageFileList(boardImageFileList));

        if(!loginUser || loginUser.email !== writerEmail) {
          navigator(MAIN_PATH());
          return;
        }

         //본문 내용 스크롤 없애기
        if(!contentRef.current)
          
          return;
          contentRef.current.style.height ='auto';
          contentRef.current.style.height =`${contentRef.current.scrollHeight}px`;
  }

  //Event handler 제목 변경 이벤트
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setTitle(value);

    //본문 내용 스크롤 없애기
    if(!titleRef.current)
      
      return;
      titleRef.current.style.height ='auto';
      titleRef.current.style.height =`${titleRef.current.scrollHeight}px`;
  }

  //Event handler 내용 변경 이벤트
  const onContentChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setContent(value);

    //본문 내용 스크롤 없애기
    if(!contentRef.current)
      
      return;
      contentRef.current.style.height ='auto';
      contentRef.current.style.height =`${contentRef.current.scrollHeight}px`;
  }

  //Event handler 이미지 변경 이벤트
  const onImageChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files || !event.target.files.length)

      return;
      
      const file = event.target.files[0];
      //미리보기
      const imageUrl = URL.createObjectURL(file);

      const newImageUrls = imageUrls.map(item => item);

      newImageUrls.push(imageUrl);

      setImageUrls(newImageUrls);

      const newBoardImageFileList = boardImageFileList.map(item => item);

      newBoardImageFileList.push(file);

      setBoardImageFileList(newBoardImageFileList);

      if(!imageInputRef.current)

        return;

        imageInputRef.current.value = '';
  }

  //Event handler 이미지 업로드 버튼 클릭 이벤트
  const onImageUploadButtonClickHandler = () => {
    if(!imageInputRef.current)
      
      return;
      
      imageInputRef.current.click();
  }

  //Event handler 이미지 닫기 버튼 클릭 이벤트
  const onImageCloseButtonClickHandler = (deleteIndex : number) => {
    if(!imageInputRef.current)

      return;

      imageInputRef.current.value = '';

      const newImageUrls = imageUrls.filter ((url,index) => index !== deleteIndex);

      setImageUrls(newImageUrls);

      const newBoardImageFileList = boardImageFileList.filter((file,index) => index !== deleteIndex);

      setBoardImageFileList(newBoardImageFileList);
  }

  //Effect mount 실행
  useEffect(() => {

    const accessToken = cookies.accessToken;

    if(!accessToken){
      navigator(MAIN_PATH());
      return;
    }
    if(!boardNumber)
      return;
    getBoardRequest(boardNumber).then(getBoardResponse);
  },[boardNumber]);


  //Render 게시물 수정화면
  return (
    <div id='board-update-wrapper'>
      <div className='board-update-container'>
        <div className='board-update-box'>
          <div className='board-update-title-box'>
            <textarea ref={titleRef} className='board-update-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler}/>
          </div>
          <div className='divider'></div>
          <div className='board-update-content-box'>
            <textarea ref={contentRef} className='board-update-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler}/>
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}} onChange={onImageChangeHandler}/>
          </div>
          <div className='board-update-images-box'>
            {imageUrls.map((imageUrl,index) =>

            <div className='board-update-image-box'>
              <img className='board-update-image' src={imageUrl}/>
              <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                <div className='icon close-icon'></div>
              </div>
            </div>
)}
            </div>
          </div>
        </div>
      </div>
  )
}

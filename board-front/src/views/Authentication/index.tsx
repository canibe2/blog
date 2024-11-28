import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import './style.css';
import InputBox from 'components/InputBox';
import { SignInRequestDto } from 'apis/request/auth';
import { signInRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import SignInResponseDto from 'apis/response/auth/sign-in.response.dto';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from 'constants/index';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';


//Component 인증
export default function Authentication() {

  //State 화면 상태
  const [view,setView] = useState<'sign-in' | 'sign-up'> ('sign-in');

  //State 쿠키 상태
  const [cookies, setCookie] = useCookies();

  //Function Navigate 함수
  const navigator = useNavigate();

  //Component sign in
  const SignInCard = () => {

    //State  이메일 요소 참조
    const emailRef = useRef<HTMLInputElement | null>(null);

    //State 패스워드 요소 참조
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //State 이메일 상태
    const [email,setEmail] = useState<string>('');

    //State 패스워드 상태
    const [password,setPassword] = useState<string>('');

    //State 패스워드 타입 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

    //State 에러 상태
    const [error,setError] = useState<boolean>(false);

    //State 패스워드 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
    
    //Function sign in response 처리
    const signInResponse = (responseBody : SignInResponseDto | ResponseDto | null) => {

      if (!responseBody) {
        alert('네트워크 이상입니다.');
        return;
      }
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code === 'SF' || code === 'VF')  setError(true);
      if(code !== 'SU') return;

      const { token , expirationTime } = responseBody as SignInResponseDto;

      const now = new Date().getTime();
      const expires = new Date( now + expirationTime * 1000);

      setCookie('accessToken',token,{expires,path:MAIN_PATH()});

      navigator(MAIN_PATH());

    }

    //Event handler 이메일 변경 이벤트
    const onEmailChangeHandler = (event : ChangeEvent<HTMLInputElement>) =>{
      setError(false);
      const {value} = event.target;
      setEmail(value);
    }

    //Event handler 비밀번호 변경 이벤트
    const onPasswordChangeHandler = (event : ChangeEvent<HTMLInputElement>) =>{
      setError(false);
      const {value} = event.target;
      setPassword(value);
    }

    //Event Handler 로그인 버튼 클릭 이벤트
    const onSignInButtonClickHandler = () => {

      const requestBody : SignInRequestDto = { email , password};

      signInRequest(requestBody).then(signInResponse);

    };

    //Event Handler 회원가입 링크 클릭 이벤트
    const onSignUpLinkClickHandler = () => {
      setView('sign-up');
    }


    //Event Handler 패스워드 버튼 클릭 이벤트
    const onPasswordButtonClickHandler = () => {
      if(passwordType === 'text'){
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      }
      else {
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
      }
    }

    //Event Handler 이메일 input key down 이벤트
    const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!passwordRef.current) return;
      passwordRef.current.focus();
      
    }

     //Event Handler 패스워드 input key down 이벤트
    const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onSignInButtonClickHandler();

    }

    //Render
    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'로그인'}</div>
            </div>
            <InputBox ref={emailRef} label='이메일주소' type='text' placeholder='이메일 주소를 입력해주세요.' error={error} value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler}/>
            <InputBox ref={passwordRef} label='패스워드' type={passwordType} placeholder='비밀번호를 입력해주세요.' error={error} value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
          </div>
          <div className='auth-card-bottom'>
            {error &&
            <div className='auth-sign-in-error-box'>
              <div className='auth-sign-in-error-message'>
                {'이메일 주소 또는 비밀번호를 잘못 입력하였습니다. \n 내용을 다시 확인해주세요.'}
              </div>
            </div>
            }
            <div className='black-large-full-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
            <div className='auth-description-box'>
              <div className='auth-description'>{'신규 사용자이신가요? '}<span className='auth-description-link' onClick={onSignUpLinkClickHandler}>{'회원가입'}</span></div>
            </div>
          </div>
        </div>
      </div>
    );

  };

    //Component sign up
  const SignUpCard = () => {

    //State 이메일 요소 참조
    const emailRef = useRef<HTMLInputElement | null>(null);

    //State 패스워드 요소 참조
    const passwordRef = useRef<HTMLInputElement | null>(null);

    //State 패스워드 확인 요소 참조
    const passwordCheckRef = useRef<HTMLInputElement | null>(null);

    //State 닉네임 요소 참조
    const nicknameRef = useRef<HTMLInputElement | null>(null);

    //State 휴대폰번호 요소 참조
    const telNumberRef = useRef<HTMLInputElement | null>(null);

    //State 주소 요소 참조
    const addressRef = useRef<HTMLInputElement | null>(null);

    //State 상세주소 요소 참조
    const addressDetailRef = useRef<HTMLInputElement | null>(null);

    //State 페이지 번호 상태
    const [page, setPage] = useState<1 | 2 >(2);

    //State 이메일 상태
    const [email, setEmail] = useState<string>('');

    //State 패스워드 상태
    const [password, setPassword] = useState<string>('');

    //State 패스워드 확인 상태
    const [passwordCheck, setPasswordCheck] = useState<string>('');

    //State 닉네임 상태
    const [nickname, setNickname] = useState<string>('');

    //State 휴대폰 번호 상태
    const [telNumber, setTelNumber] = useState<string>('');

    //State 주소 상태
    const [address, setAddress] = useState<string>('');

    //State 상세 주소 상태
    const [addressDetail, setAddressDetail] = useState<string>('');

    //State 패스워드 타입 상태
    const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');

    //State 패스워드 확인 타입 상태
    const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');

    //State 이메일 에러 상태
    const [isEmailError, setEmailError] = useState<boolean>(false);

    //State 패스워드 에러 상태
    const [isPasswordError, setPasswordError] = useState<boolean>(false);

    //State 패스워드 확인 에러 상태
    const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);

    //State 닉네임 에러 상태
    const [isNicknameError, setNicknameError] = useState<boolean>(false);

    //State 휴대폰번호 에러 상태
    const [isTelNumberError, setTelNumberError] = useState<boolean>(false);

    //State 주소 에러 상태
    const [isAddressError, setAddressError] = useState<boolean>(false);

    //State 이메일 에러 메시지 상태
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

    //State 패스워드 에러 메시지 상태
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');

    //State 패스워드 확인 에러 메시지 상태
    const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

    //State 닉네임 에러 메세지 상태
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');

    //State 휴대폰 번호 에러 메세지 상태
    const [telNumberErrorMessage,setTelNumberErrorMessage] = useState<string>('');

    //State 주소 에러 메세지 상태
    const [AddressErrorMessage,setAddressErrorMessage] = useState<string>('');

    //State 개인정보 동의 에러 상태
    const [isAgreedPersonalError,setAgreedPersonalError] = useState<boolean>(false);


    //State 패스워드 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

    //State 패스워드 확인 버튼 아이콘 상태
    const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

    //State 개인정보 동의 상태
    const [agreedPersonal,setAgreedPersonal] = useState<boolean>(false);

    //Function 다음 주소 검색 팝업 오픈소스
    const  open = useDaumPostcodePopup();

    //Event handler 이메일 변경 이벤트
    const onEmailChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setEmail(value);
      setEmailError(false);
      setEmailErrorMessage('');
    }

    //Event handler 패스워드 변경 이벤트
    const onPasswordChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setPassword(value);
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    //Event handler 패스워드 확인 변경 이벤트
      const onPasswordCheckChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setPasswordCheck(value);
      setPasswordCheckError(false);
      setPasswordErrorMessage('');
    }

    //Event handler 닉네임 변경 이벤트
    const onNicknameChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setNickname(value);
      setNicknameError(false);
      setNicknameErrorMessage('');
    }

    //Event handler 휴대폰번호 변경 이벤트
    const onTelNumberChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setTelNumber(value);
      setTelNumberError(false);
      setTelNumberErrorMessage('');
    }

    //Event handler 주소변경 변경 이벤트
    const onAddressChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setAddress(value);
      setAddressError(false);
      setAddressErrorMessage('');
    }

    //Event handler 상세주소 변경 이벤트
    const onAddressDetailChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setAddressDetail(value);
    }
    //Event handler 개인정보동의 체크박스 이벤트
    const onAgreedPersonalClickHandler = () => {
      setAgreedPersonal(!agreedPersonal);
      setAgreedPersonalError(false);
    }

    //Event handler 패스워드 버튼 클릭 이벤트
    const onPasswordButtonClickHandler = () => {
      if(passwordButtonIcon === 'eye-light-off-icon'){
        setPasswordButtonIcon('eye-light-on-icon');
        setPasswordType('text');
      } else {
        setPasswordButtonIcon('eye-light-off-icon');
        setPasswordType('password');
      }
    }

     //Event handler 패스워드 확인 버튼 클릭 이벤트
      const onPasswordCheckButtonClickHandler = () => {
      if(passwordCheckButtonIcon === 'eye-light-off-icon'){
        setPasswordCheckButtonIcon('eye-light-on-icon');
        setPasswordCheckType('text');
      } else {
        setPasswordCheckButtonIcon('eye-light-off-icon');
        setPasswordCheckType('password');
      }
    }

    //Event handler 주소 버튼 클릭 이벤트
    const onAddressButtonClickHandler = () => {
      open({onComplete});
    }

    //Event handler 다음 단계 버튼 클릭 이벤트
    const onNextButtonClickHandler = () => {

      const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;

      const isEmailPattern = emailPattern.test(email);

    if(!isEmailPattern){
      setEmailError(true);
      setEmailErrorMessage('이메일 주소가 맞지 않습니다.');
    }
    const isCheckedPassword = password.trim().length > 8;
    if(isCheckedPassword){

      setPasswordError(true);
      setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
    }
    const isEqualPassword = password === passwordCheck;
    if(!isEqualPassword) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage('비밀번호가 맞지 않습니다.');
    }
    if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) return;
      setPage(2);
    }

    //Event handler 회원가입 버튼 클릭 이벤트
    const onSignUpButtonClickHandler = () => {
    alert('회원가입 버튼');
    }

    //Event handler 로그인 링크 클릭 이벤트
    const onSignInLickClickHandler = () => {
      setView('sign-in');
    }

    //Event handler 이메일 키 다운 이벤트
      const onEmailKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!passwordRef.current) return;
      passwordRef.current.focus();
    }

     //Event handler 패스워드 키 다운 이벤트
      const onPasswordKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!passwordCheckRef.current) return;
      passwordCheckRef.current.focus();
    }

     //Event handler 패스워드 확인 키 다운 이벤트
      const onPasswordCheckKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onNextButtonClickHandler();
      if(!nicknameRef.current) return;
      onNextButtonClickHandler();
      nicknameRef.current.focus();
    }

    //Event handler 닉네임 키 다운 이벤트
    const onNicknameKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!telNumberRef.current) return;
      telNumberRef.current.focus();
    }

    //Event handler 휴대폰 번호 키 다운 이벤트
    const onTelNumberKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onAddressButtonClickHandler();
    }

    //Event handler 주소 키 다운 이벤트
    const onAddressKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }

    //Event handler 상세주소 키 다운 이벤트
    const onAddressDetailKeyDownHandler = (event : KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      onSignUpButtonClickHandler();
    }

    //Event handler 다음 주소 검색 완료 이벤트
    const onComplete = (data:Address) => {

      const { address } = data;
      setAddress(address);
      if(!addressDetailRef.current) return;
      addressDetailRef.current.focus();
    }


    //Render
    return (
      <div className='auth-card'>
        <div className='auth-card-box'>
          <div className='auth-card-top'>
            <div className='auth-card-title-box'>
              <div className='auth-card-title'>{'회원가입'}</div>
              <div className='auth-card-page'>{`${page}/2`}</div>
            </div>
            {page === 1 && (
              <>
            <InputBox ref={emailRef} label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요.' value={email} onChange={onEmailChangeHandler} error={isEmailError} message={emailErrorMessage} onKeyDown={onEmailKeyDownHandler}/>
            <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} placeholder='비밀번호를 입력해주세요.' value={password} onChange={onPasswordChangeHandler} error={isPasswordError} message={passwordErrorMessage} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler}/>
            <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} placeholder='비밀번호를 다시 입력해주세요.' value={passwordCheck} onChange={onPasswordCheckChangeHandler} error={isPasswordCheckError} message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon} onButtonClick={onPasswordCheckButtonClickHandler} onKeyDown={onPasswordCheckKeyDownHandler}/>
              </>
            )}
            {page === 2 && (
              <>
              <InputBox ref={nicknameRef} label='닉네임*' type='text' placeholder='닉네임을 입력해주세요.' value={nickname} onChange={onNicknameChangeHandler} error={isNicknameError} message={nicknameErrorMessage} onKeyDown={onNicknameKeyDownHandler}/>
              <InputBox ref={telNumberRef} label='휴대폰번호*' type='text' placeholder='휴대폰번호를 입력해주세요.' value={telNumber} onChange={onTelNumberChangeHandler} error={isTelNumberError} message={telNumberErrorMessage} onKeyDown={onTelNumberKeyDownHandler}/>
              <InputBox ref={addressRef} label='주소' type='text' placeholder='우편번호 찾기' value={address} onChange={onAddressChangeHandler} error={isAddressError} message={AddressErrorMessage} icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler} onKeyDown={onAddressKeyDownHandler}/>
              <InputBox ref={addressDetailRef} label='상세주소' type='text' placeholder='상세주소를 입력해주세요.' value={addressDetail} onChange={onAddressDetailChangeHandler} error={false} onKeyDown={onAddressDetailKeyDownHandler} />
              </>
            )}
          </div>
            <div className='auth-card-bottom'>
              {page === 1 && (
                <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
              )}
              {page ===2 && (
                <>
                <div className='auth-consent-box'>
                  <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                  <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                  </div>
                  <div className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title'}>{'개인정보동의'}</div>
                  <div className='auth-consent-link'>{'더보기 >'}</div>
                </div>
                <div className='black-large-full-button' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
                </>
              )}
              <div className='auth-description-box'>
                <div className='auth- description'>{'이미 계정이 있으신가요? '}<span className='auth-description-link' onClick={onSignInLickClickHandler}>{'로그인'}</span></div>
              </div>
            </div>
        </div>
      </div>
    );
  
    };


//Render
  return (
    <div id='auth-wrapper'>
        <div className='auth-container'>
            <div className='auth-jumbotron-box'>
              <div className='auth-jumbotron-contents'>
                <div className='auth-logo-icon'></div>
                <div className='auth-jumbotron-text-box'>
                  <div className='auth-jumbotron-text'>{'환영합니다'}</div>
                  <div className='auth-jumbotron-text'>{'블로그 입니다'}</div>
                </div>
              </div>
            </div>
            {view === 'sign-in' && <SignInCard/>}
            {view === 'sign-up' && <SignUpCard/>}
        </div>
    </div>
  );
};

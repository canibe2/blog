import React, { forwardRef , Dispatch , SetStateAction, ChangeEvent, KeyboardEvent} from 'react';
import './style.css';
//interface
interface Props {
  label : string;
  type : 'text' | 'password';
  placeholder : string;
  value : string;
  onChange : (event : ChangeEvent<HTMLInputElement>) => void;
  error : boolean;

  icon? : 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
  onButtonClick? : () => void;

  message? : string;

  onKeyDown? : (event : KeyboardEvent<HTMLInputElement>) => void;
  

}
// component
const InputBox = forwardRef<HTMLInputElement, Props> ((props: Props, ref) =>{


  const { label , type, error , placeholder, value, icon, message} = props;
  const {onChange, onButtonClick, onKeyDown} = props;

// input 키 이벤트 처리 함수
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown)  return;
        onKeyDown(event);
  }

  //render Input box
  return (
    <div className="inputbox">
      <div className="inputbox-label">{label}</div>
      <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
        <input
          ref={ref}
          type={type}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDownHandler}
        />
        {onButtonClick !== undefined && (
          <div className="icon-button" onClick={onButtonClick}>
            {icon !== undefined && <div className={`icon ${icon}`}></div>}
          </div>
        )}
      </div>
      {message !== undefined && <div className="inputbox-message">{message}</div>}
    </div>
  );
  
});

export default InputBox;




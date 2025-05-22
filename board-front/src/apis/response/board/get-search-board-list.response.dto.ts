import { BoardListItem } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface getSearchBoardListResponseDto extends ResponseDto{
    searchList : BoardListItem[];
}
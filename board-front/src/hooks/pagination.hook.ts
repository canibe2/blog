import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage : number) => {
    
    //State 전체 객체 리스트
    const [totalList, setTotalList] = useState<T[]>([]);

    //State 보여줄 객체
    const [viewList, setViewList] = useState<T[]>([]);
    
    //State 현재 페이지 번호
    const [currentPage, setCurrentPage] = useState<number>(1);

    //State 전체 페이지 번호 리스트
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);

    //State 보여줄 페이지 번호
    const [viewPageList, setViewPageList] = useState<number[]>([1]);

    //State 현재 섹션
    const [currentSection, setCurrentSection] = useState  <number>(1);

    //State 전체 섹션
    const [totalSection, setTotalSection] = useState<number>(1);

    //Function 보여줄 객체 리스트 추출
    const setView = () => {
        const FIRST_INDEX = countPerPage * (currentPage -1);
        const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length;
        const viewPageList = totalList.slice(FIRST_INDEX,LAST_INDEX );
        setViewList(viewList);
    };

     //Function 보여줄 페이지 리스트 추출
        const setViewPage = () => {
            const FIRST_INDEX = 10 * (currentSection -1);
            const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
            const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
            setViewPageList(viewPageList);

    };

    //Effect total list가 변경 될때마다 실행
    useEffect(() => {
        const totalPage = Math.ceil (totalList.length / countPerPage);
        const totalPageList : number[] = [];
        
        for(let page = 1; page <= totalPage; page++) totalPageList.push(page);
        setTotalPageList(totalPageList);
        
        const totalSection = Math.ceil (totalList.length / (countPerPage * 10));
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);

        setView();
        setViewPage();
    }, [totalList]);
    
    //Effect current page가 변경 될때마다 실행
    useEffect(setView,[currentPage]);

    //Effect current section이 변경 될때마다 실행
    useEffect(setViewPage,[currentPage]);

    return {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList

    };


};

export default usePagination;
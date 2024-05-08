import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moviebadge from '../../../assets/JejuPlay/moviebadge.png'
import stageboard from '../../../assets/JejuPlay/stageboard.png'
import mardarin from '../../../assets/JejuPlay/mandarin.png'
import dummydata from '../../../data/drama';
import SoloUser from '../../../components/JejuPlay/SoloUser';
import {
  Container,
  Answer,
  AnswerBox,
  Content,
  Hint,
  MandarinBadge,
  QuizBox,
  Stage,
  StageBox,
  TypeBadge,
  StageText,
  Alert
} from './OtherPlayPage.styled'

const OtherPlayPage = () => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<Quiz|null>(null);
  const [stage, setStage] = useState<number>(1)
  const answerRef = useRef<HTMLInputElement|null>(null);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>('');
  const [lifeCnt, setLifeCnt] = useState<number>(3);

  interface Quiz {
    readonly dramaId: number,
    content: string,
    title: string
  }

  const selectRandomQuiz = () => {
    if (dummydata.length > 0) {
      const randomIndex = Math.floor(Math.random() * dummydata.length);
      return dummydata[randomIndex];
    }
    return null;
  };

  const checkAnswer = (answer:string|undefined) => {
    console.log('함수 정상 작동!!', answer)
    if (answer && answer === quiz?.title) {
      // 정답 맞았을때 로직
      setStage(prevStage => prevStage + 1)
      if (answerRef.current) {answerRef.current.value = "";}
      setQuizList(quizList.filter(quiz => quiz.dramaId !== quiz.dramaId));
      setQuiz(selectRandomQuiz());
      setAlert('정답!');
      setTimeout(() => {
        setAlert('');
      }, 1000);
    } else if (answer && answer !== quiz?.title) {
      // 틀렸을때 로직
      if (answerRef.current) {answerRef.current.value = "";}
      setAlert('오답!');
      setTimeout(() => {
        setAlert('');
      }, 1000);
      setLifeCnt(prevLifeCnt => prevLifeCnt - 1)
    } else {
      // 제출한 답이 ''이거나 null일때 로직
      if (answerRef.current) {answerRef.current.value = "";}
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(``, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   }
        // });
        // const data = await response.json();
        setQuizList(dummydata);
        setQuiz(selectRandomQuiz());
        console.log('데이터 로드 성공')
      } catch (error) {
        console.log('데이터 로드 실패', error)
      }
    }
    fetchData()
  }, []);
  
  useEffect(() => {
    if (lifeCnt === 0) {
      setTimeout(() => {
        navigate('/jeju-play/gameover');
      }, 300);
    }
  }, [lifeCnt, navigate]);

  return (
    <Container>
      <StageBox>
        <Stage src={stageboard} alt='stageboard'></Stage>
        <StageText>{stage}</StageText>
      </StageBox>
      <QuizBox>
        <TypeBadge src={moviebadge} alt='moviebadge'></TypeBadge>
        <Content>{quiz?.content}</Content>
      </QuizBox>
      <AnswerBox>
        <MandarinBadge src={mardarin} alt='mandarin'></MandarinBadge>
        <Answer ref={answerRef} placeholder='제목을 입력하세요.' onKeyDown={(e) => {if(e.key === 'Enter') {checkAnswer(answerRef.current?.value)}}}></Answer>
      </AnswerBox>
      <SoloUser alert={alert} lifeCnt={lifeCnt}/>
    </Container>
  );
};

export default OtherPlayPage;
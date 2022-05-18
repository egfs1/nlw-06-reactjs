import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import logoImg from "../assets/images/logo.svg"
import '../styles/room.scss'
import { Question } from "../components/Question";
import { useRoom } from "../contexts/useRoom";
import deleteImg from '../assets/images/delete.svg'
import { database } from "../services/firebase";
import { FiSliders } from "react-icons/fi";

type RoomParams = {
    id: string
}

export function AdminRoom(){
    const navigate = useNavigate()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const {questions, title, isAdmin, isClosed} = useRoom(roomId)

    if(isClosed){
        navigate(`/`)
    }

    if(isAdmin !== undefined && !isAdmin){
        navigate(`/rooms/${roomId}`)
    }
    
    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date()
        })

        navigate('/')
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        const question = questions.find(q => q.id === questionId)
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !question.isAnswered
        })
    }

    async function handleHighlightQuestion(questionId: string){
        const question = questions.find(q => q.id === questionId)
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !question.isHighlighted
        })
    }


    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que você deseja excluir esta pergunta?")){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (       
        <div id="page-room">
            <header>
                <div className="content">
                    <img onClick={()=> navigate('/')} src={logoImg} alt="" />
                    <div>
                        <div className="div-icon">
                            {isAdmin && <button onClick={() => navigate(`/rooms/${roomId}`)}><FiSliders className="icon"/></button>}
                        </div>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.length === 0 ? (
                        <div className="questions-empty">
                            <h2>Sem Perguntas :(</h2>
                        </div>
                    ): (<></>)}
                    {questions.map((question,key) =>{
                        return (
                            <Question 
                            key={key}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                            >   
                                <button
                                className={question.isAnswered ? 'button-answered' : '' }
                                type="button"
                                onClick={()=> handleCheckQuestionAsAnswered(question.id)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>                                    
                                </button>
                                {!question.isAnswered && (
                                    <button
                                    className={question.isHighlighted ? 'button-highlighted' : '' }
                                    type="button"
                                    onClick={()=> handleHighlightQuestion(question.id)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                )}
                                <button
                                type="button"
                                onClick={()=> handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
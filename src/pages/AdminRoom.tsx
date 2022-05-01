import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import logoImg from "../assets/images/logo.svg"
import '../styles/room.scss'
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { Question } from "../components/Question";
import { useRoom } from "../contexts/useRoom";
import deleteImg from '../assets/images/delete.svg'
import { database } from "../services/firebase";

type RoomParams = {
    id: string
}

export function AdminRoom(){
    const {user} = useAuth()
    const navigate = useNavigate()
    const params = useParams<RoomParams>()
    const roomId = params.id

    const {questions, title} = useRoom(roomId)

    async function handleEndRoom(){
        database.ref(`rooms/${roomId}`).update({
            closedAt: new Date()
        })

        navigate('/')
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
                    <img src={logoImg} alt="" />
                    <div>
                        <RoomCode code={roomId}/>
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
                    {questions.map((question,key) =>{
                        return (
                            <Question 
                            key={key}
                            content={question.content}
                            author={question.author}
                            >
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
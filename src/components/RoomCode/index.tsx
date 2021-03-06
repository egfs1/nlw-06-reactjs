import copyImg from '../../assets/images/copy.svg'
import './styles.scss'

type RoomCodeProps = {
    code: string
}

export function RoomCode(props: RoomCodeProps){
    function copyRoomodeToCliboard(){
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={copyRoomodeToCliboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>{props.code}</span>
        </button>
    )
}
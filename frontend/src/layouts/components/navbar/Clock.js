import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

class Clock extends React.Component{
    _isMounted = false;

    constructor(props) {
		super(props)
		this.state = {
			time: new Date()
		}
	}
	
	componentDidMount() {
        this._isMounted = true;
		setInterval(this.update, 1000)
	}
	
	update = () => {
        if (this._isMounted) {
            this.setState({
                time: new Date()
            })
            
        }
    };
    componentWillUnmount() {
        this._isMounted = false;
    }

    render(){
        const h = this.state.time.getHours()
        const m = this.state.time.getMinutes()
        const s = this.state.time.getSeconds()
        return(
        <div className="header-time-bar">
            <div className="header-clock-time">
                <FontAwesomeIcon color="#1a9a65" icon={faClock} />
                <h1 className='header-clock-hour'>&nbsp;{h % 12}:{(m < 10 ? '0' + m : m)}:{(s < 10 ? '0' + s : s)}&nbsp;</h1><span className="header-clock-def">{h < 12 ? 'AM' : 'PM'}&nbsp;</span>
            </div>
        </div>
        )
    }
}

export default Clock;
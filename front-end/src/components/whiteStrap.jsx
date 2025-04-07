export function RoadDivider(props){
    if (props.ver == true) {
        return (
            <div className="verStrip"></div>
        )
    }
    else{
       return (
       <div className="horStrip"></div>
    ) 
    }
}
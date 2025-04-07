import React from "react";

export function SmallWidgets(props) {
    return (
            <div className='widget-Item' id={props.id} >{ props.name ? <p>{ props.name } : { props.value }</p> : <></> } 
                {props.children}
            </div>
    )
}
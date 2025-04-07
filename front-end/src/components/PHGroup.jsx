import { SmallWidgets } from "./smallWidgets";
import { TurbidityGauge } from "./TurbudityGauge";

export function PHGroup(props){
    return (
        <div className="PHGroup">
            <SmallWidgets name="PH" id="PH" value={props.PH} />
            <SmallWidgets name="TDS" id="TDS" value={props.TDS} />
            <TurbidityGauge value={props.Turbidity} />
        </div>
    )
}
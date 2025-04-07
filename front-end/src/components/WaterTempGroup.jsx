import { SmallWidgets } from "./smallWidgets";
import { TempGauge } from './WaterTempGauge'

export function WaterTemp(props){
    return (
        <div className="WaterTemp">
            <SmallWidgets name="Water Temperature" id="WaterTemperature" value={props.temp + "°C"} />
            <SmallWidgets name="Water Level" id="WaterLevel" value={props.level + "%"} />
            {/* <SmallWidgets name="Water Temp Gauge" id="WaterTempGauge" /> */}
            <TempGauge value={props.temp} />
        </div>
    )
}

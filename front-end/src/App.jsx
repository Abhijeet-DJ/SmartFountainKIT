import React from "react";
import {Card} from './components/Card'
import { RoadDivider } from './components/whiteStrap'

import './App.css'

export default function App(){
  return (
    <div className="Container-Main">
      <h1>
        <p>Smart Fountain</p>
          <RoadDivider />
          <RoadDivider />
          <RoadDivider />
          <RoadDivider />
      </h1>
      <div className="Card-Container">
      <Card id="Fountain_1" />
      <div className="Road">
        <RoadDivider ver={ true } />
        <RoadDivider ver={ true } />
        <RoadDivider ver={ true } />
        <RoadDivider ver={ true } />
      </div>
      <Card id="Fountain_2" />
      </div>
    </div>
  )
}
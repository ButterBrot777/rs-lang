import React from "react";

export default function StatisticString(prop) {
  function playAudio() {
      let path = prop.wordData.audioExample;
      let audio = new Audio(`https://raw.githubusercontent.com/22-22/rslang/rslang-data/data/${path}`);
      audio.play()
  }
  return (
      <div className={'statistic__string'}>
          <button onClick={() => playAudio()}>Звук</button>
          <p>{`${prop.wordData.textExample}`}</p>
      </div>
  )
}
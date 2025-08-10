import styles from "./RankingTable.module.css";
import oukanIcon from "../assets/oukan.svg";
import ranking1Icon from "../assets/ranking_1.svg";
import ranking2Icon from "../assets/ranking_2.svg";
import ranking3Icon from "../assets/ranking_3.svg";
import { BACKEND_URL } from "../config";
import { useState, useEffect } from "react";

const fakeRankingData = [
  {
    id: 1,
    who: "友達",
    when: "昨日",
    where: "大阪",
    what: "お笑いライブを見た",
    voteCount: 100,
  },
  {
    id: 2,
    who: "家族",
    when: "先週",
    where: "北海道",
    what: "旅行に行った",
    voteCount: 80,
  },
  {
    id: 3,
    who: "会社の同僚",
    when: "今朝",
    where: "会議室",
    what: "新しいプロジェクトの発表をした",
    voteCount: 60,
  },
  {
    id: 4,
    who: "兄",
    when: "先月",
    where: "京都",
    what: "お寺を訪れた",
    voteCount: 50,
  },
  {
    id: 5,
    who: "先生",
    when: "去年の夏",
    where: "沖縄の海",
    what: "スキューバダイビングを体験した",
    voteCount: 40,
  },
  {
    id: 6,
    who: "知らない人",
    when: "さっき",
    where: "駅のホーム",
    what: "親切に道を教えてくれた",
    voteCount: 30,
  },
  {
    id: 7,
    who: "ペットのポチ",
    when: "今日の午後",
    where: "公園の芝生",
    what: "元気に走り回っていた",
    voteCount: 20,
  },
  {
    id: 8,
    who: "社長",
    when: "一昨日",
    where: "ニューヨーク支社",
    what: "オンライン会議をしていた",
    voteCount: 10,
  },
  {
    id: 9,
    who: "妹",
    when: "3日前",
    where: "家",
    what: "美味しいクッキーを焼いてくれた",
    voteCount: 5,
  },
  {
    id: 10,
    who: "おばあちゃん",
    when: "週末",
    where: "庭",
    what: "綺麗な花を植えていた",
    voteCount: 1,
  },
];

function RankingTable() {
  const [rankingData, setRankingData] = useState([]);

  const rankingIconList = [ranking1Icon, ranking2Icon, ranking3Icon];

  useEffect(() => {
    async function fetchRankingData() {
      try {
        const response = await fetch(`${BACKEND_URL}/ranking`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setRankingData(data);
      } catch (error) {
        console.error("Error fetching ranking data:", error);
        setRankingData(fakeRankingData);
      }
    }

    fetchRankingData();
  }, []);

  return (
    <>
      <table className={styles.borderedtable}>
        <thead>
          <tr>
            <th>
              <img
                src={oukanIcon}
                alt="King's Crown"
                className={styles.icons}
              />
              <span>今週のランキング</span>
              <img
                src={oukanIcon}
                alt="King's Crown"
                className={styles.icons}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rankingData.map((item, index) => {
            return (
              <tr key={index}>
                <td className={styles.tablerow}>
                  <div className={styles.rowprefix}>
                    <div>
                      {index < 3 ? (
                        <img
                          src={rankingIconList[index]}
                          alt={`Rank ${index + 1}`}
                          className={styles.icons}
                        />
                      ) : (
                        `${index + 1}.`
                      )}
                    </div>
                    <div>
                      <strong>{item.values[2]}</strong>
                      <span>{item.values[0]}</span>
                      <span>{item.values[1]}</span>
                      <span>{item.values[3]}</span>
                    </div>
                  </div>
                  <div className={styles.votecount}>{item.likes}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default RankingTable;

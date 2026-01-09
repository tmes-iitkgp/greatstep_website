import mineo from "../../Assets/Events/mineo.jpg";
import nmic from "../../Assets/Events/nmic.jpg";
import petro from "../../Assets/Events/petro.jpg";
import safetydata from "../../Assets/Events/safetydata.jpg";
import safetyhunt from "../../Assets/Events/safetyhunt.jpg";
import mineac from "../../Assets/Events/mineac.jpg";
import quizSpell from "../../Assets/Events/quizSpell.jpg";
import geobotics from "../../Assets/Events/geobotics.jpg";
import enviro from "../../Assets/Events/enviro.jpg";
import gth from "../../Assets/Events/gth.gif";
import ms from "../../Assets/Events/ms.jpg";
import idp from "../../Assets/Events/IDP.jpg";
import quizomania from "./publiQuiz.jpg";
import pitch_perfect from "../../Assets/Events/pitch_perfect.jpeg";
import code_ext from "../../Assets/Events/code_ext.jpg";
import mine_a_thon from "../../Assets/Events/mine_a_thon.jpg";

const data = [
  {
    type: "Tech Events 2025",
    _id: 1,
    data: [
      {
        id: "Safety_DA",
        to: "/great-step/events/competitions/Safety_DA",
        name: "Mine Safety and Geo-Data Analytics",
        img: safetydata,
         live: true,
      },
      // {
      //   id: "code_ext",
      //   to: "/great-step/events/competitions/code_ext",
      //   name: "CODE-X-TRACTION",
      //   img: code_ext,
      //   // live: true,
      // },
      // {
      //   id: "Mine_A_Thon",
      //   to: "/great-step/events/competitions/Mine_A_Thon",
      //   name: "Mine-A-Thon",
      //   img: mine_a_thon,
      //   // live: true,
      // },
    ],
  },

  {
    type: "Oncampus Events 2025",
    _id: 2,
    data: [
      {
        id: "Petro_CS",
        to: "/great-step/events/competitions/Petro_CS",
        name: "Petro Case Study",
        img: petro,
         live: true,
      },
      {
        id: "Enviro_CS",
        to: "/great-step/events/competitions/Enviro_CS",
        img: enviro,
        name: "Enviro Case Study",
        live: true,
      },
      {
        id: "Mine_CS",
        to: "/great-step/events/competitions/Mine_CS",
        name: "National Mining Innovation Challenge",
        img: mineo,
         live: true,
        // mineo cs is replaced by nmic ***
      },
      {
        id: "Safety_Hunt",
        to: "/great-step/events/competitions/Safety_Hunt",
        name: "Safety Hunt",
        img: safetyhunt,
        live: true,
      },
      {
        id: "Geobotics",
        to: "/great-step/events/competitions/Geobotics",
        name: "Geobotics",
        img: geobotics,
        live: true,
      },
      {
        id: "Indu_Design",
        img: idp,
        to: "/great-step/events/competitions/Indu_Design",
        name: "Industrial Design",
      live: true,
      },
      // {
      //   id: "Pitch_Perfect",
      //   img: pitch_perfect,
      //   to: "/great-step/events/competitions/Pitch_Perfect",
      //   name: "Pitch Perfect",
      //   // live: true,
      // },
      {
        id: "Nmic",
        to: "/great-step/events/competitions/Nmic",
        name: "Rock - Resiliance",
        img: nmic,
        live: true,
        // nmic is replaced by rock resiliance ***
      },
      {
        id: "Mineac",
        img: mineac,
        to: "/great-step/events/competitions/Mineac",
        name: "Mineac",
        live: true,
      },
    ],
  },
  {
    type: "Online Events 2025",
    _id: 3,
    data: [
      {
        id: "Quiz_Spiel",
        to: "/great-step/events/competitions/QS",
        name: "Quiz Spiel",
        img: quizSpell,
        // live: true,
      },
      {
        id: "Mine_Shot",
        img: ms,
        to: "/great-step/events/competitions/MS",
        name: "Mine Shot",
        live: true,
      },
    ],
  },
  {
    type: "Have Fun",
    _id: 4,
    data: [
      {
        id: "gth",
        img: gth,
        to: "/great-step/events/competitions/gth",
        name: "Guess The Theme",
        // live: true,
      },
      {
        id: "publiQuiz",
        img: quizomania,
        to: "/great-step/events/competitions/quiz",
        name: "Quizomania",
        // live: true,
      },
    ],
  },
];

export default data;

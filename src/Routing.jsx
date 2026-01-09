import React from "react";

import { Routes, Route } from "react-router-dom";
import {
  GreatStep,
  Error,
  Competitions,
  Workshops,
  PanelDiscussion,
  About,
} from "./Pages";
import MINESHOT from "./Pages/Events/Mine_Shot";

import TMES from "./TMES/TMES_landing/TMES";

// import { T_Shirt_Design, Quiz_Spiel, Mine_Shot } from "./Pages/Events";

import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import ProfilePage from "./Pages/Profile/Profile";
import Sample from "./Pages/Sample/Sample";
import ScrollToTop from "./ScrollToTop";
import Gth from "./Pages/Events/Gth";
import Competition from "./Pages/Events/Comp";
import EnviroCS from "./Pages/Events/Enviro_CS";
import EventsMain from "./Pages/Events/EventsMain";
import PubliQuiz from "./Pages/Events/publiQuiz";
import Mine_CS from "./Pages/Events/Mine_CS";
import Petro_CS from "./Pages/Events/Petro_CS";
import Quiz_Spiel from "./Pages/Events/Quiz_Spiel";
import Safety_Hunt from "./Pages/Events/Safety_Hunt";
import Geobotics from "./Pages/Events/Geobotics";
import Indu_Design from "./Pages/Events/Indu_Design";
import Pitch_Perfect from "./Pages/Events/Pitch_Perfect";
import Nmic from "./Pages/Events/Nmic";
import Mineac from "./Pages/Events/mineac";
import { Payment } from "./Pages/Payment/Payment";
import { ResetPassword } from "./Pages/ResetPassword/ResetPassword";
import { ChangePassword } from "./Pages/ResetPassword/ChangePassword";
import Safety_DA from "./Pages/Events/Safety_Data";
import Code_Ext from "./Pages/Events/Code_Ext";
import Mine_A_Thon from "./Pages/Events/Mine_A_Thon";

const Routing = () => {
  return (
    <>
      <div className="content">
        <ScrollToTop />
        <Routes>
          {/* GreatStep Page */}
          <Route path="/" exact element={<GreatStep />} />
          <Route path="/sample" element={<Sample />} />
          <Route path="/tmes" element={<TMES />} />

          {/* Offline Event Page */}
          <Route path="/great-step/events" element={<EventsMain />}>
            <Route path="competitions" element={<Competitions />} />
            <Route path="workshops" element={<Workshops />} />
            <Route path="panel-discussion" element={<PanelDiscussion />} />
          </Route>
          <Route
            path="/great-step/events/competitions/QS"
            element={<Quiz_Spiel />}
          />
          <Route
            path="/great-step/events/competitions/Enviro_CS"
            element={<EnviroCS />}
          />
          <Route
            path="/great-step/events/competitions/Petro_CS"
            element={<Petro_CS />}
          />
          <Route
            path="/great-step/events/competitions/Mine_CS"
            element={<Mine_CS />}
          />
          <Route
            path="/great-step/events/competitions/Safety_Hunt"
            element={<Safety_Hunt />}
          />
          <Route
            path="/great-step/events/competitions/Safety_DA"
            element={<Safety_DA />}
          />
          <Route
            path="/great-step/events/competitions/Geobotics"
            element={<Geobotics />}
          />
          <Route
            path="/great-step/events/competitions/Pitch_Perfect"
            element={<Pitch_Perfect />}
          />
          <Route
            path="/great-step/events/competitions/Nmic"
            element={<Nmic/>}
          />
          <Route
            path="/great-step/events/competitions/code_ext"
            element={<Code_Ext/>}
          />
          <Route
            path="/great-step/events/competitions/Mine_A_Thon"
            element={<Mine_A_Thon/>}
          />
          <Route path="/great-step/events/competitions/gth" element={<Gth />} />
          <Route
            path="/great-step/events/competitions/MS"
            element={<MINESHOT />}
          />
          <Route
            path="/great-step/events/competitions/quiz"
            element={<PubliQuiz />}
          />
          <Route
            path="/great-step/events/competitions/Indu_Design"
            element={<Indu_Design />}
          />
          <Route
            path="/great-step/events/competitions/Mineac"
            element={<Mineac />}
          />
          <Route
            path="/great-step/events/competitions/:compID"
            element={<Competition />}
          />

          

          {/* About Page */}
          <Route path="/aboutus" element={<About />} />

          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route
            path="/changePassword/:email/:token"
            element={<ChangePassword />}
          />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Payment Page */}
          <Route path="/payment" element={<Payment />} />

          {/* Admin Panel */}
          {/* <Route path="/admin" element={<AdminPanel />} /> */}

          {/* Error Page */}
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </>
  );
};

export default Routing;

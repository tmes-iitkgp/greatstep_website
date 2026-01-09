import React, { useState, useEffect } from "react";
import { Footer, Loader } from "./Components";
import Navbar from "./Components/Navbar/Navbar1";
import Routing from "./Routing";
import { AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import homeVariants from "./Components/Variants";

import "./App.scss";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2800);
  }, [loading]);

  return (
    <AnimatePresence>
      <div key={1} className="App container-fluid p-0">
        {loading && <Loader />}
        {!loading && (
          <motion.div
            variants={homeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Navbar />
            <Routing />
            <Footer />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

export default App;

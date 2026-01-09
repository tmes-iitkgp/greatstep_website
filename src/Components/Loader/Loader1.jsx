import React from "react";
import { motion } from "framer-motion";
import "./Loader1.scss";

function Loader() {
  const Parent = {
    initial: {
      y: 0,
    },
    animate: {
      y: 0,

      transition: {
        staggerChildren: 0.3,
        staggerDirection: 1,
      },
    },
  };
  const letter = {
    initial: {
      y: 100,
      opacity: 0,
      skewY: 100,
    },
    animate: {
      y: 0,
      opacity: 1,
      skewY: 0,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="loader">
      <motion.div
        animate={{ scale: 3, opacity: 0 }}
        transition={{
          delay: 1,
          duration: 2,
          opacity: 0,
        }}
        variants={{
          exit: {
            opacity: 0,
          },
        }}
        className="Name "
      >
        <motion.span
          className="animate-charcter"
          animate={{ y: [100, 0] }}
          transition={{ delay: 0.3 }}
        >
          G
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [-100, 0] }}
          transition={{ delay: 0.5 }}
        >
          R
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [100, 0] }}
          transition={{ delay: 0.3 }}
        >
          E
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [-100, 0] }}
          transition={{ delay: 0.5 }}
        >
          A
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [100, 0] }}
          transition={{ delay: 0.3 }}
        >
          T
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [100, 0] }}
          transition={{ delay: 0.3 }}
        >
          {" "}
          -{" "}
        </motion.span>

        <motion.span
          className="animate-charcter"
          animate={{ y: [-100, 0] }}
          transition={{ delay: 0.5 }}
        >
          S
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [-100, 0] }}
          transition={{ delay: 0.5 }}
        >
          T
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [-100, 0] }}
          transition={{ delay: 0.5 }}
        >
          E
        </motion.span>
        <motion.span
          className="animate-charcter"
          animate={{ y: [-100, 0] }}
          transition={{ delay: 0.5 }}
        >
          P
        </motion.span>
      </motion.div>

      <motion.span
        variants={Parent}
        initial="initial"
        animate="animate"
        className="motto"
      >
        <motion.span className="text__tmes" variants={letter}>
          T
        </motion.span>
        <motion.span className="text__tmes" variants={letter}>
          M
        </motion.span>
        <motion.span className="text__tmes" variants={letter}>
          E
        </motion.span>
        <motion.span className="text__tmes" variants={letter}>
          S
        </motion.span>
      </motion.span>
    </div>
  );
}

export default Loader;

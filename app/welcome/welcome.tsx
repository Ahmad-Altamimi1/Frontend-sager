import logoLight from "~assets/Icon/SagerLogo.svg";
import { Link } from "react-router";
import { motion } from "framer-motion";

export function Welcome() {
  return (
    <main className=" bg-zinc-950 text-zinc-100  overflow-hidden">
      <div className=" w-full px-6 relative text-center">
        <div className="mb-8">
          <div className="w-32 mx-auto mb-6">
            <img src={logoLight} alt="Sager" className="block w-full" />
          </div>
          <Link to="/map" className="inline-flex">
            <motion.span
              className="inline-flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚁 Skip Intro
            </motion.span>
          </Link>
        </div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-red-400">No Time to Die 💀</h1>

          <div className="">
            <div className="text-zinc-300 text-lg leading-relaxed space-y-4">
              <p>
                🕐 <strong>5 PM:</strong> "Finally back from work! Time for
                sager task!"
              </p>
              <p>
                🕐 <strong>6 PM:</strong> "Let me just eating first..."
              </p>
              <p>
                🕐 <strong>8 PM:</strong> "Okay, now I can start coding!"
              </p>
              <p>
                🕐 <strong>12 AM:</strong> "I just want to sleep... 😴"
              </p>
            </div>
          </div>

          {/* Funny quote */}
          <motion.div
            className="mt-6 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-zinc-400 italic">
              "I used to have hobbies. Now I have deadlines."
              <br />
              <span className="text-xs">- Every Developer Ever</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom message */}
        <motion.div
          className="mt-8 text-center text-zinc-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p>
            🚁 Click "Skip Intro" to see the actual drone map • ⏰ Because time
            is money, and we're all broke on time
          </p>
        </motion.div>
      </div>
    </main>
  );
}
